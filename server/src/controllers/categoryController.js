import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import SubCategory from "../models/SubCategory.js";

// Helper function
async function uploadCategoryImage(file) {
  if (!file) return null;
  const result = await uploadImageToCloudinary(file.path, "category");
  return { url: result.url, publicId: result.publicId };
}

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

async function findOrCreateCategory(name, imageData, isActive) {
  const normalized = name.trim().toLowerCase();
  let category = await Category.findOne({ name: normalized });

  if (!category) {
    category = await Category.create({
      name: normalized,
      ...(imageData && { categoryImage: imageData }),
      isActive: isActive === "false" ? false : true,
    });
  }

  return category;
}

async function findOrCreateSubCategory(name, categoryId) {
  const normalized = name.trim().toLowerCase();
  let sub = await SubCategory.findOne({
    name: normalized,
    category: categoryId,
  });
  if (!sub)
    sub = await SubCategory.create({ name: normalized, category: categoryId });
  return sub;
}

// Admin controller
// export const createOrUpdateCategory = asyncHandler(async (req, res) => {
//   let { name, categoryId, subCategoryName, isActive } = req.body;

//   let subCategories = req.body.subCategories;
//   if (typeof subCategories === "string") {
//     try {
//       subCategories = JSON.parse(subCategories);
//     } catch {
//       subCategories = [subCategories];
//     }
//   }

//   const imageData = await uploadCategoryImage(req.file);

//   let category;

//   if (categoryId) {
//     if (!isValidObjectId(categoryId))
//       throw AppError.badRequest("Invalid categoryId", "INVALID_CATEGORY_ID");

//     category = await Category.findById(categoryId);
//     if (!category) throw AppError.notFound("Category not found", "NOT_FOUND");

//     // If caller also sent a new image while referencing by ID → replace it
//     if (imageData) {
//       if (category.categoryImage?.publicId) {
//         await deleteImageFromCloudinary(category.categoryImage.publicId);
//       }
//       category.categoryImage = imageData;
//       await category.save();
//     }
//   } else if (name) {
//     category = await findOrCreateCategory(name, imageData, isActive);
//   } else {
//     throw AppError.badRequest(
//       "Provide either 'name' or 'categoryId'",
//       "BAD_REQUEST",
//     );
//   }

//   // CASE 1: subCategories array
//   if (Array.isArray(subCategories) && subCategories.length > 0) {
//     const results = await Promise.all(
//       subCategories.map((subName) =>
//         findOrCreateSubCategory(subName, category._id),
//       ),
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Category and subcategories processed",
//       data: { category, subCategories: results },
//     });
//   }

//   // CASE 2 / 3: single subCategoryName
//   if (subCategoryName) {
//     const subCategory = await findOrCreateSubCategory(
//       subCategoryName,
//       category._id,
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Category and subcategory processed",
//       data: { category, subCategory },
//     });
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Category processed",
//     data: { category },
//   });
// });

export const createOrUpdateCategory = asyncHandler(async (req, res) => {
  let { name, categoryId, subCategoryName, isActive } = req.body;

  // Normalize subCategoryName → always array
  let subCategoriesArray = [];

  if (Array.isArray(subCategoryName)) {
    subCategoriesArray = subCategoryName;
  } else if (typeof subCategoryName === "string") {
    try {
      const parsed = JSON.parse(subCategoryName);
      subCategoriesArray = Array.isArray(parsed) ? parsed : [subCategoryName];
    } catch {
      subCategoriesArray = [subCategoryName];
    }
  }

  // 🔹 Upload image (optional)
  const imageData = await uploadCategoryImage(req.file);

  let category;

  if (categoryId) {
    if (!isValidObjectId(categoryId)) {
      throw AppError.badRequest("Invalid categoryId", "INVALID_CATEGORY_ID");
    }

    category = await Category.findById(categoryId);
    if (!category) {
      throw AppError.notFound("Category not found", "NOT_FOUND");
    }

    // ✅ update fields
    if (name) category.name = name;
    if (isActive !== undefined) category.isActive = isActive;

    // ✅ update image
    if (imageData) {
      if (category.categoryImage?.publicId) {
        await deleteImageFromCloudinary(category.categoryImage.publicId);
      }
      category.categoryImage = imageData;
    }

    await category.save();
  } else if (name) {
    category = await findOrCreateCategory(name, imageData, isActive);
  } else {
    throw AppError.badRequest(
      "Provide either 'name' or 'categoryId'",
      "BAD_REQUEST",
    );
  }

  let subCategories = [];

  if (subCategoriesArray.length > 0) {
    subCategories = await Promise.all(
      subCategoriesArray.map((subName) =>
        findOrCreateSubCategory(subName, category._id),
      ),
    );
  }

  res.status(200).json({
    success: true,
    message:
      subCategories.length > 0
        ? "Category and subcategories processed successfully"
        : "Category processed successfully",
    data: {
      category,
      subCategories, // empty array if none
    },
  });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    withSubCategories = "true",
  } = req.query;

  // Build filter
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Execute queries
  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Category.countDocuments(filter),
  ]);

  let data = categories;

  if (withSubCategories === "true") {
    data = await Promise.all(
      categories.map(async (cat) => {
        const subs = await SubCategory.find({
          category: cat._id,
        });
        return { ...cat.toObject(), subCategories: subs };
      }),
    );
  }

  // calculate product count in each category
  data = await Promise.all(
    data.map(async (cat) => {
      const productCount = await Product.countDocuments({
        category: cat._id,
      });
      return { ...cat, productCount };
    }),
  );

  return res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    category: data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getCategoryDetails = asyncHandler(async (req, res) => {
  const { categoryIdOrSlug } = req.params;
  const { withSubCategories = "true" } = req.query;

  let query = {};

  // Check if identifier is ObjectId
  if (mongoose.Types.ObjectId.isValid(categoryIdOrSlug)) {
    query.$or = [{ _id: categoryIdOrSlug }, { slug: categoryIdOrSlug }];
  } else {
    query.slug = categoryIdOrSlug;
  }

  const category = await Category.findOne(query);

  if (!category) {
    throw AppError.notFound("Category not found", "NOT_FOUND");
  }

  let data = category.toObject();

  if (withSubCategories === "true") {
    data.subCategories = await SubCategory.find({ category: category._id });
  }

  res.status(200).json({
    success: true,
    message: "Category details fetched successfully",
    data,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, isActive, subCategories } = req.body;

  // Find category
  const category = await Category.findById(categoryId);
  if (!category) {
    throw AppError.notFound("Category not found", "NOT_FOUND");
  }

  // Update category name (with duplicate check)
  if (name && name !== category.name) {
    const existingCategory = await Category.findOne({
      name: name.toLowerCase(),
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      throw AppError.conflict(
        "Category with this name already exists",
        "CATEGORY_EXISTS",
      );
    }

    category.name = name;
  }

  // Update isActive
  if (isActive !== undefined) {
    category.isActive = isActive;
  }

  await category.save();

  let updatedSubCategories = [];

  if (Array.isArray(subCategories) && subCategories.length > 0) {
    updatedSubCategories = await Promise.all(
      subCategories.map(async (sub) => {
        const { subCategoryId, name } = sub;

        if (!isValidObjectId(subCategoryId)) {
          throw AppError.badRequest(
            "Invalid subCategoryId",
            "INVALID_SUBCATEGORY_ID",
          );
        }

        const subCategory = await SubCategory.findById(subCategoryId);

        if (!subCategory) {
          throw AppError.notFound("SubCategory not found", "NOT_FOUND");
        }

        // Optional: ensure belongs to this category
        if (subCategory.category.toString() !== categoryId) {
          throw AppError.badRequest(
            "SubCategory does not belong to this category",
            "INVALID_RELATION",
          );
        }

        // Update name
        if (name && name !== subCategory.name) {
          // Duplicate check inside same category
          const duplicate = await SubCategory.findOne({
            name: name.toLowerCase(),
            category: categoryId,
            _id: { $ne: subCategoryId },
          });

          if (duplicate) {
            throw AppError.conflict(
              "SubCategory with this name already exists",
              "SUBCATEGORY_EXISTS",
            );
          }

          subCategory.name = name;
        }

        await subCategory.save();
        return subCategory;
      }),
    );
  }

  res.status(200).json({
    success: true,
    message: "Category and subcategories updated successfully",
    data: {
      category,
      subCategories: updatedSubCategories,
    },
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Find category
  const category = await Category.findById(categoryId);

  if (!category) {
    throw AppError.notFound("Category not found", "NOT_FOUND");
  }

  if (req.query.hard === "true") {
    if (category.categoryImage?.publicId) {
      await deleteImageFromCloudinary(category.categoryImage.publicId);
    }
    await category.deleteOne();
    await SubCategory.deleteMany({ category: categoryId });

    return res
      .status(200)
      .json({ success: true, message: "Category permanently deleted" });
  }

  // Soft delete
  category.isActive = false;
  await category.save();
  await SubCategory.updateMany({ category: categoryId }, { isActive: false });

  return res.status(200).json({
    success: true,
    message: "Category deactivated",
    data: category,
  });
});

export const updateCategoryStatus = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw AppError.notFound("Category not found", "NOT_FOUND");
  }

  category.isActive = !category.isActive;
  await category.save();

  res.status(200).json({
    success: true,
    message: `Category ${
      category.isActive ? "activated" : "deactivated"
    } successfully`,
  });
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
  const { subCategoryId } = req.params;

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory)
    throw AppError.notFound("SubCategory not found", "NOT_FOUND");

  if (req.query.hard === "true") {
    await subCategory.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "SubCategory permanently deleted" });
  }

  subCategory.isActive = false;
  await subCategory.save();

  return res.status(200).json({
    success: true,
    message: "SubCategory deactivated",
    data: subCategory,
  });
});

//users controllers
export const getAllCategoriesController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  // Filter
  const filter = { isActive: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  // Pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Query
  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),

    Category.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: categories,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

export const getCategoryDetailsController = asyncHandler(async (req, res) => {
  const { categoryIdOrSlug } = req.params;

  let query = { isActive: true };

  // Check ObjectId or slug
  if (mongoose.Types.ObjectId.isValid(categoryIdOrSlug)) {
    query.$or = [{ _id: categoryIdOrSlug }, { slug: categoryIdOrSlug }];
  } else {
    query.slug = categoryIdOrSlug;
  }

  // Get category
  const category = await Category.findOne(query).lean();

  if (!category) {
    throw AppError.notFound("Category not found", "NOT_FOUND");
  }

  const productCount = await Product.countDocuments({
    category: category._id,
  });

  res.status(200).json({
    success: true,
    data: {
      ...category,
      productCount,
    },
  });
});

export const getAllSubCategories = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  const filter = {
    isActive: true,
  };
  if (category) {
    filter.category = category;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [subCategories, total] = await Promise.all([
    SubCategory.find(filter)
      .populate("category", "name slug categoryImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    SubCategory.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: "Subcategories fetched successfully",
    data: subCategories,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});
