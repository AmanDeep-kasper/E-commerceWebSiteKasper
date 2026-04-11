import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { deleteImageFromCloudinary } from "../config/cloudinary.js";

// ─────────────────────────────────────────────
// Helper: delete images array from Cloudinary (best-effort)
// ─────────────────────────────────────────────
const cloudDelete = (images = []) =>
  Promise.allSettled(
    images
      .filter((img) => img?.publicId)
      .map((img) => deleteImageFromCloudinary(img.publicId)),
  );

// ─────────────────────────────────────────────
// CREATE Product
// POST /api/products
//
// Expected body:
// {
//   productTittle  : String  (required)
//   description    : String
//   category       : ObjectId (required)
//   subcategory    : ObjectId (required)
//   isActive       : Boolean
//   isDraft        : Boolean
//
//   variants: [
//     {
//       variantName          : String
//       variantColor         : String
//       variantWeight        : Number
//       variantWeightUnit    : "kg"|"g"|"mg"
//       variantSkuId         : String  (required, unique)
//       variantMrp           : Number  (required)
//       variantCostPrice     : Number
//       variantSellingPrice  : Number  (required)
//       variantGST           : Number  (required)
//       variantDiscount      : Number
//       variantAvailableStock      : Number
//       variantLowStockAlertStock  : Number (required)
//       isSelected           : Boolean
//
//       // Images already uploaded via POST /api/upload/images
//       variantImage: [{ url, publicId, altText }]
//     }
//   ]
// }
// ─────────────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const {
      productTittle,
      description,
      category,
      subcategory,
      isActive,
      isDraft,
      variants,
    } = req.body;

    // ── Basic validation ──────────────────────
    if (!productTittle) {
      return res
        .status(400)
        .json({ success: false, message: "productTittle is required" });
    }
    if (!category || !subcategory) {
      return res
        .status(400)
        .json({
          success: false,
          message: "category and subcategory are required",
        });
    }
    if (!variants || variants.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one variant is required" });
    }

    // ── Variant SKU uniqueness (within request) ──
    const skuIds = variants.map((v) => v.variantSkuId);
    if (new Set(skuIds).size !== skuIds.length) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Duplicate variantSkuId found in request",
        });
    }

    // ── Variant SKU uniqueness (against DB) ──────
    const existingSkus = await Product.aggregate([
      { $unwind: "$variants" },
      { $match: { "variants.variantSkuId": { $in: skuIds } } },
      { $project: { sku: "$variants.variantSkuId", _id: 0 } },
    ]);
    if (existingSkus.length > 0) {
      return res.status(409).json({
        success: false,
        message: `SKU(s) already exist: ${existingSkus.map((s) => s.sku).join(", ")}`,
      });
    }

    // ── Ensure only one isSelected variant ───────
    let selectedSet = false;
    const cleanVariants = variants.map((v) => {
      if (v.isSelected && !selectedSet) {
        selectedSet = true;
        return { ...v, isSelected: true };
      }
      return { ...v, isSelected: false };
    });
    // Default first variant as selected if none chosen
    if (!selectedSet) cleanVariants[0].isSelected = true;

    const product = await Product.create({
      productTittle,
      description,
      category,
      subcategory,
      isActive: isActive ?? true,
      isDraft: isDraft ?? false,
      variants: cleanVariants,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Slug or SKU already exists",
        detail: error.keyValue,
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET All Products  (with filter + pagination)
// GET /api/products
//
// Query params:
//   page, limit, search, category, subcategory,
//   isActive, isDraft, minPrice, maxPrice,
//   sort (field), order (asc|desc)
// ─────────────────────────────────────────────
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      subcategory,
      isActive,
      isDraft,
      minPrice,
      maxPrice,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};

    if (search) {
      filter.productTittle = { $regex: search, $options: "i" };
    }
    if (category) filter.category = new mongoose.Types.ObjectId(category);
    if (subcategory)
      filter.subcategory = new mongoose.Types.ObjectId(subcategory);
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (isDraft !== undefined) filter.isDraft = isDraft === "true";

    if (minPrice || maxPrice) {
      filter["variants.variantSellingPrice"] = {};
      if (minPrice)
        filter["variants.variantSellingPrice"].$gte = Number(minPrice);
      if (maxPrice)
        filter["variants.variantSellingPrice"].$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortObj = { [sort]: order === "asc" ? 1 : -1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .populate("category", "name")
        .populate("subcategory", "name"),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// GET Single Product
// GET /api/products/:identifier  →  id OR slug
// ─────────────────────────────────────────────
export const getProduct = async (req, res) => {
  try {
    const { identifier } = req.params;

    const filter = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier }
      : { slug: identifier };

    const product = await Product.findOne(filter)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("reviews");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE Product  (non-variant fields)
// PATCH /api/products/:id
//
// Allowed fields: productTittle, description, category,
//   subcategory, isActive, isDraft
// Slug auto-updates via schema pre-hook on productTittle change.
// ─────────────────────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const allowed = [
      "productTittle",
      "description",
      "category",
      "subcategory",
      "isActive",
      "isDraft",
    ];
    const updateData = {};
    for (const field of allowed) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No valid fields to update" });
    }

    // findOneAndUpdate triggers the pre("findOneAndUpdate") hook for slug
    const product = await Product.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true, runValidators: true },
    )
      .populate("category", "name")
      .populate("subcategory", "name");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({
          success: false,
          message: "Slug conflict — try a different title",
          detail: error.keyValue,
        });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE Product  (+ all variant images from Cloudinary)
// DELETE /api/products/:id
// ─────────────────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete all variant images from Cloudinary (best-effort)
    for (const variant of product.variants) {
      await cloudDelete(variant.variantImage);
    }

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// ADD Variant
// POST /api/products/:id/variants
//
// Body: single variant object (same shape as VariantSchema)
// variantImage should already be uploaded URLs from /api/upload/images
// ─────────────────────────────────────────────
export const addVariant = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const newVariant = req.body;

    if (!newVariant.variantSkuId) {
      return res
        .status(400)
        .json({ success: false, message: "variantSkuId is required" });
    }

    // SKU uniqueness check
    const skuExists = await Product.findOne({
      "variants.variantSkuId": newVariant.variantSkuId,
    });
    if (skuExists) {
      return res.status(409).json({
        success: false,
        message: `variantSkuId '${newVariant.variantSkuId}' already exists`,
      });
    }

    // If new variant is isSelected, deselect others
    if (newVariant.isSelected) {
      product.variants.forEach((v) => {
        v.isSelected = false;
      });
    }

    product.variants.push(newVariant);
    await product.save();

    const added = product.variants[product.variants.length - 1];

    return res.status(201).json({
      success: true,
      message: "Variant added successfully",
      data: added,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE Variant  (non-image fields)
// PATCH /api/products/:id/variants/:variantId
// ─────────────────────────────────────────────
export const updateVariant = async (req, res) => {
  try {
    const { id, variantId } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res
        .status(404)
        .json({ success: false, message: "Variant not found" });
    }

    // If setting isSelected, deselect all others first
    if (updates.isSelected === true) {
      product.variants.forEach((v) => {
        v.isSelected = false;
      });
      variant.isSelected = true;
      delete updates.isSelected;
    }

    const allowedVariantFields = [
      "variantName",
      "variantColor",
      "variantWeight",
      "variantWeightUnit",
      "variantMrp",
      "variantCostPrice",
      "variantSellingPrice",
      "variantGST",
      "variantDiscount",
      "variantAvailableStock",
      "variantLowStockAlertStock",
    ];

    for (const field of allowedVariantFields) {
      if (updates[field] !== undefined) variant[field] = updates[field];
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Variant updated successfully",
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// UPDATE Variant Images  (replace full variantImage array)
// PUT /api/products/:id/variants/:variantId/images
//
// Body: { variantImage: [{ url, publicId, altText }] }
//
// Images that are no longer in the new array are deleted from Cloudinary.
// New images must already be uploaded via POST /api/upload/images.
// ─────────────────────────────────────────────
export const updateVariantImages = async (req, res) => {
  try {
    const { id, variantId } = req.params;
    const { variantImage = [] } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res
        .status(404)
        .json({ success: false, message: "Variant not found" });
    }

    // Find images removed by frontend and delete from Cloudinary
    const newPublicIds = new Set(variantImage.map((img) => img.publicId));
    const removed = variant.variantImage.filter(
      (img) => img.publicId && !newPublicIds.has(img.publicId),
    );
    await cloudDelete(removed);

    variant.variantImage = variantImage;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Variant images updated",
      data: variant.variantImage,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────
// DELETE Variant
// DELETE /api/products/:id/variants/:variantId
//
// Cannot delete the last variant (delete the product instead).
// If deleted variant was isSelected, first remaining variant gets selected.
// Variant images are deleted from Cloudinary.
// ─────────────────────────────────────────────
export const deleteVariant = async (req, res) => {
  try {
    const { id, variantId } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.variants.length === 1) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete the only variant. Delete the product instead.",
      });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res
        .status(404)
        .json({ success: false, message: "Variant not found" });
    }

    const wasSelected = variant.isSelected;

    // Delete variant images from Cloudinary
    await cloudDelete(variant.variantImage);

    // Remove variant from array
    product.variants.pull(variantId);

    // Re-assign isSelected if needed
    if (wasSelected && product.variants.length > 0) {
      product.variants[0].isSelected = true;
    }

    await product.save();

    return res
      .status(200)
      .json({ success: true, message: "Variant deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
