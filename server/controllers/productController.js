import Product from "../models/Product.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { syncCategoryWithProduct } from "./categoryController.js";
import { randomUUID } from "crypto";

// Helper: generate SEO-friendly slug from title
const makeSlug = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with -
    .replace(/(^-|-$)+/g, ""); // remove leading/trailing -

//  POST /add-product
export const addProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      uuid,
      route,
      title,
      category,
      subcategory,
      SKU,
      dimension,
      discountPercent,
      discountAmount,
      materialType,
      stockQuantity,
      color,
      returnPolicy,
      weight,
      type,
      description,
      tags,
      deliverBy,
      bulletPoints,
      mrp,
      sellingPrice,
      costPrice,
      profit,
      includesTax,
      taxPercent,
      hasVariants,
      variants,
    } = req.body;

    // REQUIRED FIELDS
    if (!title || !category || !SKU || !type) {
      return res.status(400).json({
        message: "Missing required fields: title, category, SKU, type",
      });
    }

    // 🔧 Helpers
    const toNumber = (v) => (v ? Number(v) : 0);
    const toBool = (v) => v === "true" || v === true;
    const normalizeField = (field, separator = ",") => {
      if (!field) return [];
      if (Array.isArray(field)) return field.map((f) => f.trim());
      if (typeof field === "string")
        return field.split(separator).map((f) => f.trim());
      return [];
    };

    // --------------------------------------------------------
    //  CLOUDINARY UPLOAD LOGIC
    // --------------------------------------------------------
    let productImages = [];
    let variantImageMap = {}; // e.g. { "0": ["url1","url2"], "1": ["url3"] }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudUrl = await uploadOnCloudinary(file.path);
        if (!cloudUrl) continue;

        // variant images → fieldname = variants[0][variantImage]
        if (file.fieldname.startsWith("variants[")) {
          const match = file.fieldname.match(
            /variants\[(\d+)\]\[variantImage\]/
          );
          if (match) {
            const index = match[1];
            if (!variantImageMap[index]) variantImageMap[index] = [];
            variantImageMap[index].push(cloudUrl);
          }
        } else {
          // product images
          productImages.push(cloudUrl);
        }
      }
    }

    // --------------------------------------------------------
    //  PARSE VARIANTS
    // --------------------------------------------------------
    let parsedVariants = [];

    if (variants) {
      try {
        let parsed;

        // If variants comes as string → parse JSON
        if (typeof variants === "string") {
          parsed = JSON.parse(variants);
        }
        // If variants is already array → use directly
        else if (Array.isArray(variants)) {
          parsed = variants;
        } else {
          parsed = [];
        }

        parsedVariants = parsed.map((v, idx) => ({
          variantId: v.variantId,
          variantType: v.variantType,
          variantName: v.variantName || "Dimension",
          variantValue:
            v.variantValue ||
            (v.width && v.height ? `${v.width}*${v.height}cm` : ""),
          height: Number(v.height) || 0,
          width: Number(v.width) || 0,
          weight: v.weight || "",
          variantQuantity: Number(v.variantQuantity) || 0,
          variantReorderLimit: Number(v.variantReorderLimit) || 0,
          variantImage: variantImageMap[idx] || [], // CLOUDINARY IMAGES
        }));
      } catch (err) {
        console.warn("⚠️ Could not parse variants JSON:", err.message);
      }
    }

    // --------------------------------------------------------
    //  CREATE PRODUCT
    // --------------------------------------------------------
    const product = new Product({
      uuid: uuid || randomUUID(),
      route: route || `/product/${makeSlug(title)}-${SKU}`,
      title,
      category,
      subcategory,
      SKU,
      dimension,
      mrp: toNumber(mrp),
      sellingPrice: toNumber(sellingPrice),
      costPrice: toNumber(costPrice),
      profit: toNumber(profit),
      discountPercent: toNumber(discountPercent),
      discountAmount: toNumber(discountAmount),
      includesTax: toBool(includesTax),
      taxPercent,
      materialType,
      stockQuantity: toNumber(stockQuantity),
      color: normalizeField(color),
      returnPolicy: toBool(returnPolicy),
      weight,
      type,
      description,
      tags: normalizeField(tags),
      deliverBy: toNumber(deliverBy) || 3,
      bulletPoints: normalizeField(bulletPoints, "|"),
      hasVariants: toBool(hasVariants),
      variants: parsedVariants,
      images: productImages, // CLOUDINARY IMAGES SAVED HERE!
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error(" Add Product Error:", err);
    res.status(500).json({ error: err.message });
  }
};

//  GET /all
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    // .populate({
    //   path: "reviews",
    //   populate: {
    //     path: "user",
    //     select: "name email profileImage",
    //   },
    // })
    // .sort({ createdAt: -1 });  // this is hide for the some reasion reviews is not the ..

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET /category/:categoryName
export const getProductByCategory = async (req, res) => {
  try {
    const category = decodeURIComponent(req.params.categoryName).trim();

    const products = await Product.find({ category }).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name email profileImage",
      },
    });

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET /products/category/:categoryName/:subcategoryName
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
      query.category = {
        $regex: `^${escapeRegex(subcategoryName)}$`,
        $options: "i",
      };
    }

    console.log("Final Query:", query);

    const products = await Product.find(query).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name email profileImage",
      },
    });

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET /product/:id (Mongo _id)
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name email profileImage",
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET /product/slug/:route
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

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  GET /categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          subcategories: { $addToSet: "$subcategory" }, // unique subcategories
        },
      },
      {
        $project: {
          name: "$_id",
          _id: 0,
          subcategories: 1,
        },
      },
    ]);

    res.status(200).json({ categories });
  } catch (err) {
    console.error("Get Categories Error:", err);
    res.status(500).json({ error: err.message });
  }
};
