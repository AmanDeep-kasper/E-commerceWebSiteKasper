import Product from "../models/Product.js";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";

//  Admin controllers
export const addProduct = asyncHandler(async (req, res) => {
  const {
    productTittle,
    description,
    variants,
    category,
    subcategory,
    action,
  } = req.body;

  // ✅ Validate variants
  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    throw AppError.badRequest(
      "At least one product variant is required",
      "MISSING_VARIANT",
    );
  }

  const processedVariants = [];

  // ✅ Loop each variant
  for (const variant of variants) {
    const {
      variantColor,
      variantName,
      varintWeight,
      varintWeightUnit,
      variantSkuId,
      variantImage,
      variantMrp,
      variantCostPrice,
      variantSellingPrice,
      varintGST,
      variantDiscount,
      variantAvailableStock,
      variantLowStockAlertStock,
      isSelected,
    } = variant;

    // ✅ Upload images per variant
    const uploadedImages = [];

    if (variantImage && Array.isArray(variantImage)) {
      for (const img of variantImage) {
        const result = await uploadImageToCloudinary(img, "products");

        uploadedImages.push({
          url: result.url,
          publicId: result.publicId,
          altText: img.altText || "",
        });
      }
    }

    // ✅ Calculate Discount
    let finalDiscount = variantMrp - variantSellingPrice;

    // calculate varint percentage
    const variantPercent = (finalDiscount / variantMrp) * 100;

    // ✅ Push cleaned variant
    processedVariants.push({
      variantColor,
      variantName,
      varintWeight,
      varintWeightUnit,
      variantSkuId,
      variantImage: uploadedImages,
      variantMrp,
      variantCostPrice,
      variantSellingPrice: finalSellingPrice,
      varintGST,
      variantDiscount,
      variantDiscountUnit,
      variantAvailableStock,
      variantLowStockAlertStock,
      isSelected,
    });
  }

  // ✅ Create product
  const product = await Product.create({
    productTittle,
    description,
    category,
    subcategory,
    variants: processedVariants,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
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
export const adminUpdateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    brand,
    shortDescription,
    fullDescription,
    categories,
    variants,
    attributes,
    metaTitle,
    metaDescription,
    metaKeywords,
    isActive,
    isFeatured,
  } = req.body;

  // Find existing product
  const product = await Product.findById(id);
  if (!product) {
    throw AppError.badRequest("Product not found", "NOT_FOUND");
  }

  // Update basic info
  if (name && name !== product.name) {
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slugExists = await Product.findOne({ slug, _id: { $ne: id } });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }
    product.slug = slug;
    product.name = name;
  }

  if (brand !== undefined) product.brand = brand;
  if (shortDescription !== undefined)
    product.shortDescription = shortDescription;
  if (fullDescription !== undefined) product.fullDescription = fullDescription;
  if (attributes !== undefined) product.attributes = attributes;
  if (metaTitle !== undefined) product.metaTitle = metaTitle;
  if (metaDescription !== undefined) product.metaDescription = metaDescription;
  if (metaKeywords !== undefined) product.metaKeywords = metaKeywords;
  if (isActive !== undefined) product.isActive = isActive;
  if (isFeatured !== undefined) product.isFeatured = isFeatured;

  // Update categories
  if (categories !== undefined) {
    const validatedCategories = await validateCategoryHierarchy(categories);
    product.categories = validatedCategories.map((c) => c._id);
  }

  // Update variants
  if (variants !== undefined && Array.isArray(variants)) {
    if (variants.length === 0) {
      throw AppError.badRequest(
        "Product must have at least one variant",
        "NO_VARIANTS",
      );
    }

    const processedVariants = variants.map((variant, index) => {
      if (
        variant.mrpPrice &&
        variant.sellingPrice &&
        variant.mrpPrice < variant.sellingPrice
      ) {
        throw AppError.badRequest(
          `MRP must be greater than selling price for variant ${index + 1}`,
          "INVALID_VARIANT_PRICING",
        );
      }

      const discountPercent =
        variant.mrpPrice && variant.sellingPrice
          ? calculateVariantDiscount(variant.mrpPrice, variant.sellingPrice)
          : variant.discountPercent || 0;

      return {
        ...variant,
        discountPercent,
      };
    });

    // Validate default variant
    const defaultVariantCount = processedVariants.filter(
      (v) => v.isDefault,
    ).length;
    if (defaultVariantCount > 1) {
      throw AppError.badRequest(
        "Only one variant can be set as default",
        "INVALID_DEFAULT_VARIANT",
      );
    }
    if (defaultVariantCount === 0 && processedVariants.length > 0) {
      processedVariants[0].isDefault = true;
    }

    product.variants = processedVariants;
  }

  await product.save();
  await updateProductStats(product._id);

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

/**
 * Delete product (Admin - Soft delete)
 */
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
 * Get all products with filters (Admin)
 */
export const adminGetAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    category,
    brand,
    isActive,
    isFeatured,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build filter
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
  if (category) filter.categories = category;
  if (brand) filter.brand = { $regex: brand, $options: "i" };

  // Price filter (based on variants)
  if (minPrice || maxPrice) {
    filter["variants.sellingPrice"] = {};
    if (minPrice) filter["variants.sellingPrice"].$gte = parseFloat(minPrice);
    if (maxPrice) filter["variants.sellingPrice"].$lte = parseFloat(maxPrice);
  }

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Sort
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Execute queries
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("categories", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  // Calculate stock status for each product
  const productsWithStock = products.map((product) => {
    const totalStock = product.variants.reduce(
      (sum, v) => sum + (v.stockQuantity || 0),
      0,
    );
    const inStock = totalStock > 0;
    const lowestPrice = Math.min(
      ...product.variants.map((v) => v.sellingPrice),
    );
    const highestPrice = Math.max(
      ...product.variants.map((v) => v.sellingPrice),
    );

    return {
      ...product,
      stockStatus: {
        totalStock,
        inStock,
        isLowStock: totalStock > 0 && totalStock <= 10,
      },
      priceRange: {
        min: lowestPrice,
        max: highestPrice,
      },
    };
  });

  res.status(200).json({
    success: true,
    data: productsWithStock,
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
      isActive,
      isFeatured,
    },
  });
});

/**
 * Get single product details (Admin)
 */
export const adminGetProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("categories", "name slug path")
    .lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Calculate additional stats
  const totalStock = product.variants.reduce(
    (sum, v) => sum + (v.stockQuantity || 0),
    0,
  );
  const variantCount = product.variants.length;
  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];

  res.status(200).json({
    success: true,
    data: {
      ...product,
      analytics: {
        totalStock,
        variantCount,
        defaultVariant,
        hasVariants: variantCount > 1,
        isInStock: totalStock > 0,
      },
    },
  });
});

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
