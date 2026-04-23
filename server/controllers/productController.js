import Product from "../models/Product.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploader.js";
import mongoose from "mongoose";

// Upload images of variants first
export const uploadVariantsImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw AppError.badRequest("No files uploaded", "NO_FILES");
  }

  const data = await Promise.all(
    req.files.map((file, i) =>
      uploadToCloudinary(
        file.buffer,
        file.mimetype.startsWith("video") ? "video" : "image",
        file.mimetype.startsWith("video") ? "product-videos" : "product-images",
        file.originalname,
      ).then((r) => ({
        url: r.url,
        publicId: r.publicId,
        altText: req.body[`altText_${i}`] || "",
      })),
    ),
  );

  res.status(200).json({
    success: true,
    message: `${data.length} images uploaded`,
    data,
  });
});

const cloudDelete = (images = []) =>
  Promise.allSettled(
    images
      .filter((img) => img?.publicId)
      .map((img) => deleteFromCloudinary(img.publicId)),
  );

//  Admin controllers
export const addProduct = asyncHandler(async (req, res) => {
  const {
    productTittle,
    description,
    category,
    subcategory,
    variants,
    action,
  } = req.body;

  if (!action || !["draft", "add"].includes(action)) {
    throw AppError.badRequest("Invalid action", "INVALID_ACTION");
  }

  const isDraft = action === "draft";

  if (!isDraft) {
    if (!variants || variants.length === 0) {
      throw AppError.badRequest(
        "At least one variant is required",
        "NO_VARIANTS",
      );
    }

    const skuIds = variants.map((v) => v.variantSkuId);
    if (new Set(skuIds).size !== skuIds.length) {
      throw AppError.badRequest(
        "Duplicate variantSkuId found in request",
        "DUPLICATE_SKU",
      );
    }

    const existingSku = await Product.aggregate([
      { $unwind: "$variants" },
      { $match: { "variants.variantSkuId": { $in: skuIds } } },
      { $project: { sku: "$variants.variantSkuId", _id: 0 } },
    ]);

    if (existingSku.length > 0) {
      throw AppError.conflict(
        `SKU(s) already exist: ${existingSku.map((s) => s.sku).join(", ")}`,
        "SKU_ALREADY_EXISTS",
      );
    }
  }

  let finalVariants = [];

  if (!isDraft) {
    const cleanVariants = variants.map((v) => {
      const mrp = Number(v.variantMrp);
      const selling = Number(v.variantSellingPrice);

      // ✅ Discount calculation
      let discountPercent = 0;

      if (mrp > 0 && selling <= mrp) {
        discountPercent = ((mrp - selling) / mrp) * 100;
      }

      // ✅ Round to 2 decimal (optional but recommended)
      discountPercent = Number(discountPercent.toFixed(2));

      return {
        ...v,
        variantMrp: mrp,
        variantSellingPrice: selling,
        variantDiscount: discountPercent,
      };
    });

    // Ensure only one isSelected variant
    let selectedSet = false;

    finalVariants = cleanVariants.map((v) => {
      if (v.isSelected && !selectedSet) {
        selectedSet = true;
        return { ...v, isSelected: true };
      }
      return { ...v, isSelected: false };
    });

    if (!selectedSet && finalVariants.length > 0) {
      finalVariants[0].isSelected = true;
    }
  }

  // ✅ Create product
  const product = new Product({
    productTittle,
    description,
    category,
    subcategory,
    variants: finalVariants,
    isDraft,
    isActive: !isDraft,
  });

  if (isDraft) {
    await product.save({ validateBeforeSave: false });
  } else {
    await product.validate();
    await product.save();
  }

  res.status(201).json({
    success: true,
    message: isDraft ? "Product saved as draft" : "Product added successfully",
    data: product,
  });
});

// export const adminGetAllProducts = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     search,
//     category,
//     status,
//     sortBy = "latest",
//   } = req.query;

//   const pageNum = parseInt(page);
//   const limitNum = parseInt(limit);
//   const skip = (pageNum - 1) * limitNum;

//   // 🔍 MATCH STAGE
//   const matchStage = {};

//   // ✅ STATUS FILTER
//   if (status === "active") matchStage.isActive = true;
//   if (status === "inactive") matchStage.isActive = false;
//   if (status === "draft") matchStage.isActive = false;

//   // 🔍 SEARCH (name, slug, sku)
//   if (search) {
//     matchStage.$or = [
//       { productTittle: { $regex: search, $options: "i" } },
//       { slug: { $regex: search, $options: "i" } },
//       { "variants.variantSkuId": { $regex: search, $options: "i" } },
//     ];
//   }

//   // 🧠 SORT LOGIC
//   let sortStage = {};

//   switch (sortBy) {
//     case "latest":
//       sortStage = { createdAt: -1 };
//       break;

//     case "oldest":
//       sortStage = { createdAt: 1 };
//       break;

//     case "atoz":
//       sortStage = { productTittle: 1 };
//       break;

//     case "ztoa":
//       sortStage = { productTittle: -1 };
//       break;

//     case "lowtohigh":
//       sortStage = { "variants.variantSellingPrice": 1 };
//       break;

//     case "hightolow":
//       sortStage = { "variants.variantSellingPrice": -1 };
//       break;

//     default:
//       sortStage = { createdAt: -1 };
//   }

//   // 🚀 AGGREGATION
//   const pipeline = [
//     { $match: matchStage },

//     // 🔗 Join category (for name search/filter)
//     {
//       $lookup: {
//         from: "categories",
//         localField: "category",
//         foreignField: "_id",
//         as: "categoryData",
//       },
//     },
//     {
//       $unwind: {
//         path: "$categoryData",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//   ];

//   // ✅ CATEGORY NAME FILTER
//   if (category) {
//     pipeline.push({
//       $match: {
//         "categoryData.name": { $regex: category, $options: "i" },
//       },
//     });
//   }

//   // ✅ SEARCH ALSO IN CATEGORY NAME
//   if (search) {
//     pipeline.push({
//       $match: {
//         $or: [
//           { productTittle: { $regex: search, $options: "i" } },
//           { slug: { $regex: search, $options: "i" } },
//           { "variants.variantSkuId": { $regex: search, $options: "i" } },
//           { "categoryData.name": { $regex: search, $options: "i" } },
//         ],
//       },
//     });
//   }

//   // 📊 SORT
//   pipeline.push({ $sort: sortStage });

//   // 📄 PAGINATION
//   pipeline.push({ $skip: skip });
//   pipeline.push({ $limit: limitNum });

//   // 🎯 CLEAN RESPONSE
//   pipeline.push({
//     $project: {
//       productTittle: 1,
//       slug: 1,
//       isActive: 1,
//       createdAt: 1,
//       category: "$categoryData.name",
//       firstImage: {
//         $arrayElemAt: [{ $arrayElemAt: ["$variants.variantImage.url", 0] }, 0],
//       },
//       price: {
//         $arrayElemAt: ["$variants.variantSellingPrice", 0],
//       },
//     },
//   });

//   // 🚀 EXECUTE
//   const products = await Product.aggregate(pipeline);

//   // ⚠️ TOTAL COUNT (important)
//   const totalPipeline = [
//     ...pipeline.filter(
//       (stage) => !stage.$skip && !stage.$limit && !stage.$sort,
//     ),
//     { $count: "total" },
//   ];
//   const totalResult = await Product.aggregate(totalPipeline);
//   const total = totalResult[0]?.total || 0;

//   res.status(200).json({
//     success: true,
//     message: "Products fetched successfully",
//     data: products,
//     pagination: {
//       total,
//       page: pageNum,
//       limit: limitNum,
//       totalPages: Math.ceil(total / limitNum),
//     },
//   });
// });

export const adminGetAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    status,
    sortBy = "latest",
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // 🔍 FILTER
  const filter = {};

  // ✅ STATUS FILTER
  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;

  // 🔍 SEARCH (name, slug, sku)
  if (search) {
    filter.$or = [
      { productTittle: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { "variants.variantSkuId": { $regex: search, $options: "i" } },
    ];
  }

  // ✅ CATEGORY FILTER (by category name)
  let categoryFilter = {};
  if (category) {
    const categoryDoc = await Category.findOne({
      name: { $regex: category, $options: "i" },
    });
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    }
  }

  // ✅ SORT OPTIONS
  let sort = {};
  switch (sortBy) {
    case "latest":
      sort = { createdAt: -1 };
      break;
    case "oldest":
      sort = { createdAt: 1 };
      break;
    case "atoz":
      sort = { productTittle: 1 };
      break;
    case "ztoa":
      sort = { productTittle: -1 };
      break;
    case "lowtohigh":
      sort = { "variants.variantSellingPrice": 1 };
      break;
    case "hightolow":
      sort = { "variants.variantSellingPrice": -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  // ✅ QUERY with populate (same as userGetAllProducts)
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const [activeCount, inactiveCount] = await Promise.all([
    Product.countDocuments({ ...filter, isActive: true }),
    Product.countDocuments({ ...filter, isActive: false }),
  ]);

  // ✅ PROCESS DATA (same structure as userGetAllProducts)
  const processedProducts = products.map((product) => {
    const variants = product.variants || [];
    const defaultVariant = variants.find((v) => v.isSelected) || variants[0];
    const prices = variants.map((v) => v.variantSellingPrice);
    const lowestPrice = prices.length ? Math.min(...prices) : 0;
    const highestPrice = prices.length ? Math.max(...prices) : 0;
    const image = defaultVariant?.variantImage?.[0]?.url || null;

    return {
      _id: product._id,
      name: product.productTittle,
      slug: product.slug,
      category: product.category,
      categoryName: product.category?.name || "N/A",
      subcategory: product.subcategory,
      subcategoryName: product.subcategory?.name || "N/A",
      isActive: product.isActive,
      isDraft: product.isDraft,
      skuId: defaultVariant?.variantSkuId || "N/A",
      priceRange: {
        min: lowestPrice,
        max: highestPrice,
        hasVariants: lowestPrice !== highestPrice,
      },
      mrp: defaultVariant?.variantMrp || 0,
      defaultPrice: defaultVariant?.variantSellingPrice || 0,
      discount: defaultVariant?.variantDiscount || 0,
      image: image,
      inStock: variants.some((v) => v.variantAvailableStock > 0),
      variantCount: variants.length,
      stats: product.stats,
      createdAt: product.createdAt,
    };
  });

  res.status(200).json({
    success: true,
    data: processedProducts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
    stats: {
      total: total || 0,
      active: activeCount || 0,
      inactive: inactiveCount || 0,
    },
  });
});

export const adminGetProductDetails = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  const filter = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const product = await Product.findOne(filter)
    .populate("category", "name")
    .populate("subcategory", "name")
    .populate("reviews")
    .lean();

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Product detail fetched successfully",
    data: product,
  });
});

export const adminUpdateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const allowed = [
    "productTittle",
    "description",
    "category",
    "subcategory",
    "isActive",
  ];

  const updateData = {};
  for (const field of allowed) {
    if (req.body[field] !== undefined) updateData[field] = req.body[field];
  }

  if (Object.keys(updateData).length === 0) {
    throw AppError.badRequest("No fields to update", "NO_UPDATES");
  }

  // Find existing product
  const product = await Product.findOneAndUpdate(
    { _id: productId },
    { $set: updateData },
    { new: true, runValidators: true },
  )
    .populate("category", "name")
    .populate("subcategory", "name");

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw AppError("Product not found", "NOT_FOUND");
  }

  product.isActive = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const adminAddVariant = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  const newVariant = req.body; // make sure payload is flat

  if (!newVariant.variantSkuId) {
    throw AppError.badRequest("variantSkuId is required", "MISSING_SKU");
  }

  // ✅ SKU uniqueness check
  const skuExists = await Product.findOne({
    "variants.variantSkuId": newVariant.variantSkuId,
  });

  if (skuExists) {
    throw AppError.conflict("SKU already exists", "SKU_ALREADY_EXISTS");
  }

  // ✅ Convert numbers
  newVariant.variantMrp = Number(newVariant.variantMrp);
  newVariant.variantSellingPrice = Number(newVariant.variantSellingPrice);

  // ✅ Validate price
  if (newVariant.variantSellingPrice > newVariant.variantMrp) {
    throw AppError.badRequest(
      "Selling price cannot exceed MRP",
      "INVALID_PRICE",
    );
  }

  // ✅ Calculate discount
  newVariant.variantDiscount = Number(
    (
      ((newVariant.variantMrp - newVariant.variantSellingPrice) /
        newVariant.variantMrp) *
      100
    ).toFixed(2),
  );

  // ✅ Handle selected variant
  if (newVariant.isSelected) {
    product.variants.forEach((v) => (v.isSelected = false));
  }

  product.variants.push(newVariant);

  await product.save();

  const added = product.variants[product.variants.length - 1];

  res.status(201).json({
    success: true,
    message: "Variant added successfully",
    data: added,
  });
});

export const adminUpdateVariant = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.params;
  const updates = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw AppError.notFound("Variant not found", "NOT_FOUND");
  }

  // ✅ Handle isSelected
  if (updates.isSelected === true) {
    product.variants.forEach((v) => (v.isSelected = false));
    variant.isSelected = true;
  }

  // ✅ Allowed fields
  const allowedVariantFields = [
    "variantName",
    "variantColor",
    "variantWeight",
    "variantWeightUnit",
    "variantMrp",
    "variantCostPrice",
    "variantSellingPrice",
    "variantGST",
    "variantAvailableStock",
    "variantLowStockAlertStock",
  ];

  // ✅ Update fields + convert numbers
  for (const field of allowedVariantFields) {
    if (updates[field] !== undefined) {
      if (
        [
          "variantMrp",
          "variantCostPrice",
          "variantSellingPrice",
          "variantGST",
          "variantAvailableStock",
          "variantLowStockAlertStock",
        ].includes(field)
      ) {
        variant[field] = Number(updates[field]);
      } else {
        variant[field] = updates[field];
      }
    }
  }

  // ✅ Recalculate Discount (IMPORTANT)
  const mrp = variant.variantMrp;
  const selling = variant.variantSellingPrice;

  if (selling > mrp) {
    throw AppError.badRequest(
      "Selling price cannot exceed MRP",
      "INVALID_PRICE",
    );
  }

  variant.variantDiscount = Number((((mrp - selling) / mrp) * 100).toFixed(2));

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Variant updated successfully",
    data: variant,
  });
});

export const adminUpdateVariantImages = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.params;
  const { variantImage = [] } = req.body;

  // ✅ Validate input
  if (!Array.isArray(variantImage)) {
    throw AppError.badRequest(
      "variantImage must be an array",
      "INVALID_FORMAT",
    );
  }

  // optional: at least 1 image required
  if (variantImage.length === 0) {
    throw AppError.badRequest(
      "At least one image is required",
      "MIN_ONE_IMAGE",
    );
  }

  // Validate each image object
  for (const img of variantImage) {
    if (!img.url || !img.publicId) {
      throw AppError.badRequest(
        "Each image must have url and publicId",
        "INVALID_IMAGE_OBJECT",
      );
    }
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw AppError.notFound("Variant not found", "NOT_FOUND");
  }

  // Find removed images
  const newPublicIds = new Set(variantImage.map((img) => img.publicId));

  const removedImages = variant.variantImage.filter(
    (img) => img.publicId && !newPublicIds.has(img.publicId),
  );

  // ✅ Delete removed images from Cloudinary
  if (removedImages.length > 0) {
    const publicIdsToDelete = removedImages.map((img) => img.publicId);

    await Promise.allSettled(
      publicIdsToDelete.map((id) => deleteFromCloudinary(id)),
    );
  }

  // Assign new images (final state)
  variant.variantImage = variantImage;

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Variant images updated successfully",
    data: variant.variantImage,
  });
});

export const adminDeleteVariant = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  if (product.variants.length === 1) {
    throw AppError.badRequest(
      "Cannot delete the only variant. Delete the product instead.",
      "ONLY_VARIANT",
    );
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw AppError.notFound("Variant not found", "NOT_FOUND");
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
});

export const adjustStock = asyncHandler(async (req, res) => {
  const { productId, variantId, quantity, stockType } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    throw AppError.notFound("Variant not found", "NOT_FOUND");
  }

  // check stock type - inStock or outStock
  if (stockType === "inStock") {
    variant.variantAvailableStock += quantity;
  } else if (stockType === "outStock") {
    variant.variantAvailableStock -= quantity;
  }

  res.status(200).json({
    success: true,
    message: "Stock adjusted successfully",
  });
});

// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);

//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     // Delete all variant images from Cloudinary (best-effort)
//     for (const variant of product.variants) {
//       await cloudDelete(variant.variantImage);
//     }

//     return res
//       .status(200)
//       .json({ success: true, message: "Product deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// ==================== USER CONTROLLERS ====================

// user controller
export const userGetAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    category,
    subcategory,
    sortBy = "latest",
    showInactive = "true",
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;


  const filter = {};

  // // ✅ CATEGORY FILTER (ObjectId)
  // if (category && mongoose.Types.ObjectId.isValid(category)) {
  //   filter.category = category;
  // }

  // // ✅ SUBCATEGORY FILTER
  // if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
  //   filter.subcategory = subcategory;
  // }

    // ✅ CATEGORY FILTER (by ID or by name from URL)
  if (category) {
    // Check if category is an ID or a name
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      // Find category by name (for URL like /products/writing instrument art c)
      const categoryDoc = await Category.findOne({ 
        name: { $regex: `^${category}$`, $options: "i" } 
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }
  }

  // ✅ SUBCATEGORY FILTER - FIXED
  if (subcategory) {
    // Find subcategory by name
    const subcategoryDoc = await SubCategory.findOne({ 
      name: { $regex: `^${subcategory}$`, $options: "i" } 
    });
    if (subcategoryDoc) {
      filter.subcategory = subcategoryDoc._id;
    }
  }

  // ✅ SEARCH (name + SKU)
  if (search) {
    filter.$or = [
      { productTittle: { $regex: search, $options: "i" } },
      { "variants.variantSkuId": { $regex: search, $options: "i" } },
    ];
  }

  // ✅ SORT OPTIONS
  let sort = {};

  switch (sortBy) {
    case "price_low":
      sort = { "variants.variantSellingPrice": 1 };
      break;

    case "price_high":
      sort = { "variants.variantSellingPrice": -1 };
      break;

    case "latest":
      sort = { createdAt: -1 };
      break;

    case "oldest":
      sort = { createdAt: 1 };
      break;

    case "az":
      sort = { productTittle: 1 };
      break;

    case "za":
      sort = { productTittle: -1 };
      break;

    case "rating":
      sort = { "stats.averageRating": -1 };
      break;

    case "popularity":
      sort = { "stats.totalSold": -1 };
      break;

    default:
      sort = { createdAt: -1 };
  }

  // ✅ QUERY
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug") //this populate category with name
      .populate("subcategory", "name slug") //this populate subcategory with name
      .select("productTittle slug variants stats createdAt")
      .select("productTittle slug variants stats createdAt isActive")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),

    Product.countDocuments(filter),
  ]);

  // ✅ PROCESS DATA
  const processedProducts = products.map((product) => {
    const variants = product.variants || [];

    const inStockVariants = variants.filter((v) => v.variantAvailableStock > 0);

    const defaultVariant = variants.find((v) => v.isSelected) || variants[0];

    const prices = variants.map((v) => v.variantSellingPrice);

    const lowestPrice = prices.length ? Math.min(...prices) : 0;
    const highestPrice = prices.length ? Math.max(...prices) : 0;

    const image = defaultVariant?.variantImage?.[0]?.url || null;

      // ✅ Extract unique colors from variants
    const availableColors = [...new Set(
      variants.map(v => v.variantColor).filter(Boolean)
    )];

    return {
      _id: product._id,
      name: product.productTittle,
      slug: product.slug,
      category: product.category, //add this
      categoryName: product.category?.name, // ← ADD THIS
      subcategory: product.subcategory,
      subcategoryName: product.subcategory?.name,
      isActive: product.isActive,
      skuId: defaultVariant?.variantSkuId || "N/A",
      priceRange: {
        min: lowestPrice,
        max: highestPrice,
        hasVariants: lowestPrice !== highestPrice,
      },

      mrp: defaultVariant?.variantMrp || 0,
      defaultPrice: defaultVariant?.variantSellingPrice || 0,
      discount: defaultVariant?.variantDiscount || 0,
      image:image,
      inStock: inStockVariants.length > 0,
      variantCount: variants.length,
      availableColors:availableColors,
      variants: variants.map((v) => ({
        variantColor:v.variantColor,
        variantName:v.variantName,
        variantSellingPrice:v.variantSellingPrice,
        _id:v._id,
      })),

      stats: product.stats,
      createdAt: product.createdAt,
    };
  });

  // ✅ RESPONSE
  res.status(200).json({
    success: true,
    data: processedProducts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

export const userGetProductDetails = asyncHandler(async (req, res) => {
  const { slugOrId } = req.params;

  // Find by slug or ID
  const query = mongoose.Types.ObjectId.isValid(slugOrId)
    ? { _id: slugOrId, isActive: true }
    : { slug: slugOrId, isActive: true };

  const product = await Product.findOne(query)
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate("reviews")
    .lean();

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }
  res.status(200).json({
    success: true,
    message: "Product details fetched successfully",
    data: product,
  });
});

export const globalSearch = asyncHandler(async (req, res) => {
  const { search } = req.query;

  if (!search) {
    throw AppError.badRequest("Search required");
  }

  const keyword = search.trim();

  // 🔥 STEP 1: Find matching categories
  const categories = await Category.find({
    name: { $regex: keyword, $options: "i" },
  }).select("_id name");

  // 🔥 STEP 2: Find matching subcategories
  const subcategories = await SubCategory.find({
    name: { $regex: keyword, $options: "i" },
  }).select("_id name");

  // 🔥 STEP 3: Build OR conditions safely
  const orConditions = [
    {
      productTittle: { $regex: keyword, $options: "i" },
    },
  ];

  if (categories.length > 0) {
    orConditions.push({
      category: { $in: categories.map((c) => c._id) },
    });
  }

  if (subcategories.length > 0) {
    orConditions.push({
      subcategory: { $in: subcategories.map((s) => s._id) },
    });
  }

  // 🔥 STEP 4: Query
  const products = await Product.find({
    isActive: true,
    $or: orConditions,
  })
    .limit(20)
    .sort({ createdAt: -1 })
    .select("productTittle variants category subcategory")
    .populate({
      path: "category",
      select: "name",
    })
    .lean();

  // 🔥 STEP 5: Format response (IMPORTANT)
  const formatted = products.map((p) => ({
    _id: p._id,
    productTittle: p.productTittle,
    categoryName: p.category?.name || "",

    // first variant image
    image: p.variants?.[0]?.variantImage?.[0]?.url || "",
  }));

  return res.status(200).json({
    success: true,
    count: formatted.length,
    products: formatted,
  });
});
