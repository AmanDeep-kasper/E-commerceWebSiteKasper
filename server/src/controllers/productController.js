import Product from "../models/Product.js";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";

// Upload images of variants first
export const uploadVariantsImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw AppError.badRequest("No files uploaded", "NO_FILES");
  }

  const data = await Promise.all(
    req.files.map((file, i) =>
      uploadImageToCloudinary(file.path, "products").then((r) => ({
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

// delete images of variants
export const deleteVariantImages = asyncHandler(async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId);
  if (!publicId) {
    throw AppError.badRequest("publicId required", "MISSING_PUBLIC_ID");
  }

  await deleteImageFromCloudinary(publicId);

  res.status(200).json({
    success: true,
    message: "Image deleted",
  });
});

const cloudDelete = (images = []) =>
  Promise.allSettled(
    images
      .filter((img) => img?.publicId)
      .map((img) => deleteImageFromCloudinary(img.publicId)),
  );

//  Admin controllers
export const addProduct = asyncHandler(async (req, res) => {
  const { productTittle, description, category, subcategory, variants } =
    req.body;

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

  const cleanVariants = variants.map((v, index) => {
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

  const finalVariants = cleanVariants.map((v) => {
    if (v.isSelected && !selectedSet) {
      selectedSet = true;
      return { ...v, isSelected: true };
    }
    return { ...v, isSelected: false };
  });

  if (!selectedSet) finalVariants[0].isSelected = true;

  // ✅ Create product
  const product = await Product.create({
    productTittle,
    description,
    category,
    subcategory,
    variants: finalVariants,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

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

  // 🔍 MATCH STAGE
  const matchStage = {};

  // ✅ STATUS FILTER
  if (status === "active") matchStage.isActive = true;
  if (status === "inactive") matchStage.isActive = false;
  if (status === "draft") matchStage.isActive = false;

  // 🔍 SEARCH (name, slug, sku)
  if (search) {
    matchStage.$or = [
      { productTittle: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { "variants.variantSkuId": { $regex: search, $options: "i" } },
    ];
  }

  // 🧠 SORT LOGIC
  let sortStage = {};

  switch (sortBy) {
    case "latest":
      sortStage = { createdAt: -1 };
      break;

    case "oldest":
      sortStage = { createdAt: 1 };
      break;

    case "atoz":
      sortStage = { productTittle: 1 };
      break;

    case "ztoa":
      sortStage = { productTittle: -1 };
      break;

    case "lowtohigh":
      sortStage = { "variants.variantSellingPrice": 1 };
      break;

    case "hightolow":
      sortStage = { "variants.variantSellingPrice": -1 };
      break;

    default:
      sortStage = { createdAt: -1 };
  }

  // 🚀 AGGREGATION
  const pipeline = [
    { $match: matchStage },

    // 🔗 Join category (for name search/filter)
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryData",
      },
    },
    {
      $unwind: {
        path: "$categoryData",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  // ✅ CATEGORY NAME FILTER
  if (category) {
    pipeline.push({
      $match: {
        "categoryData.name": { $regex: category, $options: "i" },
      },
    });
  }

  // ✅ SEARCH ALSO IN CATEGORY NAME
  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { productTittle: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
          { "variants.variantSkuId": { $regex: search, $options: "i" } },
          { "categoryData.name": { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  // 📊 SORT
  pipeline.push({ $sort: sortStage });

  // 📄 PAGINATION
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limitNum });

  // 🎯 CLEAN RESPONSE
  pipeline.push({
    $project: {
      productTittle: 1,
      slug: 1,
      isActive: 1,
      createdAt: 1,
      category: "$categoryData.name",
      firstImage: {
        $arrayElemAt: [{ $arrayElemAt: ["$variants.variantImage.url", 0] }, 0],
      },
      price: {
        $arrayElemAt: ["$variants.variantSellingPrice", 0],
      },
    },
  });

  // 🚀 EXECUTE
  const products = await Product.aggregate(pipeline);

  // ⚠️ TOTAL COUNT (important)
  const totalPipeline = [
    ...pipeline.filter(
      (stage) => !stage.$skip && !stage.$limit && !stage.$sort,
    ),
    { $count: "total" },
  ];
  const totalResult = await Product.aggregate(totalPipeline);
  const total = totalResult[0]?.total || 0;

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
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
  const { id } = req.params;
  const { permanent = false } = req.query;

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (permanent === "true") {
    // Delete all images from Cloudinary
    const allImages = [
      ...(product.images || []),
      ...product.variants.flatMap((v) => v.images || []),
    ];

    const publicIds = allImages.map((img) => img.publicId).filter(Boolean);
    if (publicIds.length > 0) {
      await deleteMultipleImagesFromCloudinary(publicIds);
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product permanently deleted successfully",
    });
  } else {
    // Soft delete - just mark as inactive
    product.isActive = false;
    await product.save();
    res.status(200).json({
      success: true,
      message: "Product deactivated successfully",
    });
  }
});

/**
 * Delete product image (Admin)
 */
export const adminDeleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;
  const { variantId = null } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  let imageToDelete = null;

  if (variantId) {
    const variant = product.variants.id(variantId);
    if (!variant) {
      throw AppError.notFound("Variant not found", "NOT_FOUND");
    }
    imageToDelete = variant.images.id(imageId);
    if (imageToDelete) {
      variant.images.pull({ _id: imageId });
    }
  } else {
    imageToDelete = product.images.id(imageId);
    if (imageToDelete) {
      product.images.pull({ _id: imageId });
    }
  }

  if (!imageToDelete) {
    throw new AppError("Image not found", 404);
  }

  // Delete from Cloudinary
  if (imageToDelete.publicId) {
    await deleteImageFromCloudinary(imageToDelete.publicId);
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Image deleted successfully",
  });
});

/**
 * Update product (Admin)
 */

/**
 * Delete product (Admin - Soft delete)
 */

// ==================== USER CONTROLLERS ====================

/**
 * Get all active products for users (with filters)
 */
export const userGetAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    inStockOnly = false,
    featured = false,
  } = req.query;

  // Build filter - only active products
  const filter = { isActive: true };
  if (featured === "true") filter.isFeatured = true;
  if (category) filter.categories = category;
  if (brand) filter.brand = { $regex: brand, $options: "i" };

  // Price filter
  if (minPrice || maxPrice) {
    filter["variants.sellingPrice"] = {};
    if (minPrice) filter["variants.sellingPrice"].$gte = parseFloat(minPrice);
    if (maxPrice) filter["variants.sellingPrice"].$lte = parseFloat(maxPrice);
  }

  // Stock filter
  if (inStockOnly === "true") {
    filter["variants.stockQuantity"] = { $gt: 0 };
  }

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { shortDescription: { $regex: search, $options: "i" } },
    ];
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Sort options for users
  let sort = {};
  switch (sortBy) {
    case "price_low":
      sort = { "variants.sellingPrice": 1 };
      break;
    case "price_high":
      sort = { "variants.sellingPrice": -1 };
      break;
    case "rating":
      sort = { "stats.averageRating": -1 };
      break;
    case "popularity":
      sort = { "stats.totalSold": -1 };
      break;
    case "newest":
      sort = { createdAt: -1 };
      break;
    default:
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  // Execute queries
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("categories", "name slug")
      .select(
        "name slug brand shortDescription variants images isFeatured stats createdAt",
      )
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  // Process products for user view
  const processedProducts = products.map((product) => {
    const activeVariants = product.variants.filter((v) => v.stockQuantity > 0);
    const defaultVariant =
      product.variants.find((v) => v.isDefault) || product.variants[0];
    const lowestPrice = Math.min(
      ...product.variants.map((v) => v.sellingPrice),
    );
    const highestPrice = Math.max(
      ...product.variants.map((v) => v.sellingPrice),
    );
    const primaryImage =
      product.images?.find((img) => img.isPrimary) ||
      product.images?.[0] ||
      defaultVariant?.images?.[0];

    return {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      shortDescription: product.shortDescription,
      priceRange: {
        min: lowestPrice,
        max: highestPrice,
        hasVariants: lowestPrice !== highestPrice,
      },
      defaultPrice: defaultVariant?.sellingPrice,
      discountPercent: defaultVariant?.discountPercent,
      image: primaryImage?.url || null,
      isFeatured: product.isFeatured,
      stats: product.stats,
      inStock: activeVariants.length > 0,
      variantCount: activeVariants.length,
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
    filters: {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStockOnly,
      featured,
    },
  });
});

/**
 * Get single product details for users
 */
export const userGetProductDetails = asyncHandler(async (req, res) => {
  const { slugOrId } = req.params;

  // Find by slug or ID
  const query = mongoose.Types.ObjectId.isValid(slugOrId)
    ? { _id: slugOrId, isActive: true }
    : { slug: slugOrId, isActive: true };

  const product = await Product.findOne(query)
    .populate("categories", "name slug path")
    .lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Process variants for user view
  const variants = product.variants.map((variant) => ({
    _id: variant._id,
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    material: variant.material,
    weightKg: variant.weightKg,
    dimensions: variant.dimensions,
    mrpPrice: variant.mrpPrice,
    sellingPrice: variant.sellingPrice,
    discountPercent: variant.discountPercent,
    stockQuantity: variant.stockQuantity,
    isDefault: variant.isDefault,
    inStock: variant.stockQuantity > 0,
    images: variant.images?.map((img) => ({
      url: img.url,
      altText: img.altText,
      isPrimary: img.isPrimary,
    })),
  }));

  // Get related products (same categories)
  const relatedProducts = await Product.find({
    isActive: true,
    categories: { $in: product.categories },
    _id: { $ne: product._id },
  })
    .limit(10)
    .select("name slug brand images variants stats")
    .lean();

  const processedRelated = relatedProducts.map((p) => {
    const defaultVariant = p.variants.find((v) => v.isDefault) || p.variants[0];
    const primaryImage =
      p.images?.find((img) => img.isPrimary) || p.images?.[0];

    return {
      _id: p._id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      price: defaultVariant?.sellingPrice,
      image: primaryImage?.url,
      averageRating: p.stats?.averageRating,
    };
  });

  // Get available filters from product
  const availableFilters = {
    sizes: [...new Set(product.variants.map((v) => v.size).filter(Boolean))],
    colors: [...new Set(product.variants.map((v) => v.color).filter(Boolean))],
    materials: [
      ...new Set(product.variants.map((v) => v.material).filter(Boolean)),
    ],
  };

  res.status(200).json({
    success: true,
    data: {
      ...product,
      variants,
      availableFilters,
      relatedProducts: processedRelated,
      inStock: variants.some((v) => v.inStock),
      hasVariants: variants.length > 1,
    },
  });
});

/**
 * Get products by category for users
 */
export const userGetProductsByCategory = asyncHandler(async (req, res) => {
  const { categorySlug } = req.params;
  const {
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Find category
  const category = await Category.findOne({
    slug: categorySlug,
    isActive: true,
  });
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // Get all subcategory IDs
  const subcategories = await Category.find({
    parentId: category._id,
    isActive: true,
  });
  const categoryIds = [category._id, ...subcategories.map((c) => c._id)];

  // Build filter
  const filter = {
    isActive: true,
    categories: { $in: categoryIds },
  };

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Sort
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("categories", "name slug")
      .select("name slug brand shortDescription variants images stats")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const processedProducts = products.map((product) => {
    const defaultVariant =
      product.variants.find((v) => v.isDefault) || product.variants[0];
    const primaryImage =
      product.images?.find((img) => img.isPrimary) || product.images?.[0];
    const lowestPrice = Math.min(
      ...product.variants.map((v) => v.sellingPrice),
    );

    return {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      price: lowestPrice,
      discountPercent: defaultVariant?.discountPercent,
      image: primaryImage?.url,
      averageRating: product.stats?.averageRating,
      totalReviews: product.stats?.totalReviews,
    };
  });

  res.status(200).json({
    success: true,
    data: {
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      products: processedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    },
  });
});

// ==================== PRODUCT REVIEW CONTROLLERS ====================

/**
 * Add product review (User)
 */
export const userAddProductReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment, title } = req.body;
  const userId = req.user._id;

  if (!rating || rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const product = await Product.findById(id);
  if (!product || !product.isActive) {
    throw new AppError("Product not found", 404);
  }

  // Check if user already reviewed
  const existingReview = product.reviews?.find(
    (review) => review.userId.toString() === userId.toString(),
  );

  if (existingReview) {
    throw new AppError("You have already reviewed this product", 400);
  }

  // Add review (you'll need to add reviews array to schema)
  if (!product.reviews) product.reviews = [];

  product.reviews.push({
    userId,
    rating,
    title,
    comment,
    isVerified: true, // You can implement purchase verification
    createdAt: new Date(),
  });

  // Update average rating
  const totalRating = product.reviews.reduce(
    (sum, review) => sum + review.rating,
    0,
  );
  product.stats.averageRating = totalRating / product.reviews.length;
  product.stats.totalReviews = product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: {
      averageRating: product.stats.averageRating,
      totalReviews: product.stats.totalReviews,
    },
  });
});

/**
 * Get product reviews (User)
 */
export const userGetProductReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const product = await Product.findById(id).select("reviews stats");
  if (!product || !product.isActive) {
    throw new AppError("Product not found", 404);
  }

  const reviews = product.reviews || [];
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;

  const paginatedReviews = reviews.slice(start, end);

  res.status(200).json({
    success: true,
    data: {
      reviews: paginatedReviews,
      stats: product.stats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: reviews.length,
        pages: Math.ceil(reviews.length / limitNum),
      },
    },
  });
});
