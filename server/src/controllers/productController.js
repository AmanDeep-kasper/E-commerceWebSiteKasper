import Product from "../models/Product.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { randomUUID } from "crypto";
import { syncCategoryWithProduct } from "./categoryController.js";

/** ----------------------------------------
 * Helpers
 * ---------------------------------------- */
const makeSlug = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const toNumber = (v) => {
  if (v === "" || v === undefined || v === null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toBool = (v) => v === "true" || v === true || v === 1 || v === "1";

function safeJsonParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/** OLD FORMAT SUPPORT:
 * variants[0][variantColor] etc.
 */
function parseVariantsFromBracketBody(body) {
  const variants = [];

  for (const key of Object.keys(body || {})) {
    const match = key.match(/^variants\[(\d+)\]\[(.+)\]$/);
    if (!match) continue;

    const idx = Number(match[1]);
    const field = match[2];

    variants[idx] = variants[idx] || {};
    variants[idx][field] = body[key];
  }

  return variants.filter(Boolean);
}

/** normalize req.files from multer:
 * - multer.array => req.files is array
 * - multer.fields => req.files is object of arrays
 */
function normalizeFiles(reqFiles) {
  if (!reqFiles) return [];
  if (Array.isArray(reqFiles)) return reqFiles;
  return Object.values(reqFiles).flat();
}

/** ----------------------------------------
 * POST /products/add-product
 * ---------------------------------------- */
export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      uuid,
      route,
      productTittle,
      description,
      status,
      category,
      subcategory,
      materialType,
      isFestive,
      productBadge,
      productTags,
      SKU,
      variants,
    } = req.body;

    if (!productTittle || !category || !SKU) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: productTittle, category, SKU",
      });
    }

    await syncCategoryWithProduct(category, subcategory);

    /** -------------------------------
     * 1) Upload images from req.files
     * ------------------------------- */
    const filesArr = normalizeFiles(req.files);

    const productImages = [];
    const variantImageMap = {}; // { 0: [url], 1: [url, url] }

    for (const file of filesArr) {
      const cloudUrl = await uploadOnCloudinary(file.path);
      if (!cloudUrl) continue;

      // Optional product images
      if (file.fieldname === "images") {
        productImages.push(cloudUrl);
        continue;
      }

      // New frontend: variantImages_0, variantImages_1 ...
      if (file.fieldname.startsWith("variantImages_")) {
        const idxStr = file.fieldname.replace("variantImages_", "");
        const idx = Number(idxStr);

        if (Number.isFinite(idx)) {
          variantImageMap[idx] = variantImageMap[idx] || [];
          variantImageMap[idx].push(cloudUrl);
        }
        continue;
      }

      // Old frontend support: variants[0][variantImage]
      if (file.fieldname.startsWith("variants[")) {
        const match = file.fieldname.match(/variants\[(\d+)\]\[variantImage\]/);
        if (match) {
          const idx = Number(match[1]);
          variantImageMap[idx] = variantImageMap[idx] || [];
          variantImageMap[idx].push(cloudUrl);
        }
      }
    }

    /** -------------------------------
     * 2) Parse variants
     * ------------------------------- */
    let variantsRaw = [];

    if (typeof variants === "string" && variants.trim()) {
      variantsRaw = safeJsonParse(variants, []);
    } else {
      variantsRaw = parseVariantsFromBracketBody(req.body);
    }

    if (!Array.isArray(variantsRaw)) variantsRaw = [];

    const parsedVariants = variantsRaw.map((v, idx) => ({
      variantId: v.variantId || randomUUID(),
      variantSkuId: v.variantSkuId || "",

      variantColor: v.variantColor || "",

      variantLength: v.variantLength || "",
      variantBreadth: v.variantBreadth || "",
      variantDimensionunit: v.variantDimensionunit || "In",

      variantWidth: v.variantWidth || "",
      variantWidthUnit: v.variantWidthUnit || "kg",

      variantMrp: toNumber(v.variantMrp),
      variantCostPrice: toNumber(v.variantCostPrice),
      variantSellingPrice: toNumber(v.variantSellingPrice),

      variantDiscount: toNumber(v.variantDiscount),
      variantDiscountUnit: v.variantDiscountUnit || "%",

      variantAvailableStock: toNumber(v.variantAvailableStock),
      variantLowStockAlertStock: toNumber(v.variantLowStockAlertStock),

      variantImage: variantImageMap[idx] || [],
      isSelected: false,
    }));

    /** -------------------------------
     * 3) Parse festive tags
     * ------------------------------- */
    let parsedProductTags = [];

    if (Array.isArray(productTags)) {
      parsedProductTags = productTags;
    } else if (typeof productTags === "string" && productTags.trim()) {
      parsedProductTags = safeJsonParse(productTags, [productTags]);
    }

    /** -------------------------------
     * 4) Create product doc
     * ------------------------------- */
    const safeRoute =
      route ||
      `/product/${makeSlug(productTittle)}-${String(SKU || "").toLowerCase()}`;

    const productDoc = new Product({
      uuid: uuid || randomUUID(),
      route: safeRoute,

      productTittle,
      description: description || "",
      status: status || "ACTIVE",

      category,
      subcategory: subcategory || "",
      materialType: materialType || "",

      isFestive: toBool(isFestive),
      productBadge: productBadge || "",
      productTags: parsedProductTags,

      SKU,
      variants: parsedVariants,

      // only keep this if your schema supports it
      images: productImages,
    });

    await productDoc.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: productDoc,
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/** ----------------------------------------
 * GET /products/all
 * ---------------------------------------- */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/** ----------------------------------------
 * GET /products/category/:categoryName
 * ---------------------------------------- */
export const getProductByCategory = async (req, res) => {
  try {
    const category = decodeURIComponent(req.params.categoryName).trim();

    const products = await Product.find({ category }).populate({
      path: "reviews",
      populate: { path: "user", select: "name email profileImage" },
    });

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/** ----------------------------------------
 * GET /products/category/:categoryName/:subcategoryName
 * ---------------------------------------- */
export const getProductsByCategoryAndSubcategory = async (req, res) => {
  try {
    const categoryName = decodeURIComponent(
      req.params.categoryName || ""
    ).trim();

    const subcategoryName = decodeURIComponent(
      req.params.subcategoryName || ""
    ).trim();

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {
      category: { $regex: `^${escapeRegex(categoryName)}$`, $options: "i" },
    };

    if (subcategoryName) {
      query.subcategory = {
        $regex: `^${escapeRegex(subcategoryName)}$`,
        $options: "i",
      };
    }

    const products = await Product.find(query).populate({
      path: "reviews",
      populate: { path: "user", select: "name email profileImage" },
    });

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/** ----------------------------------------
 * GET /products/product/:id
 * ---------------------------------------- */
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate({
      path: "reviews",
      populate: { path: "user", select: "name email profileImage" },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/** ----------------------------------------
 * GET /products/product/slug/:route
 * ---------------------------------------- */
export const getProductByRoute = async (req, res) => {
  try {
    const { route } = req.params;

    const product = await Product.findOne({ route }).populate({
      path: "reviews",
      populate: { path: "user", select: "name email profileImage" },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/** ----------------------------------------
 * GET /products/categories
 * ---------------------------------------- */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          subcategories: { $addToSet: "$subcategory" },
        },
      },
      { $project: { name: "$_id", _id: 0, subcategories: 1 } },
    ]);

    return res.status(200).json({ categories });
  } catch (err) {
    console.error("Get Categories Error:", err);
    return res.status(500).json({ error: err.message });
  }
};