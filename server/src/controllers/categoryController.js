import mongoose from "mongoose";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";

// Helper function to build category tree
const buildCategoryTree = (categories, parentId = null) => {
  const tree = [];

  for (const category of categories) {
    if (
      category.parentId?._id?.toString() === parentId?.toString() ||
      category.parentId?.toString() === parentId?.toString() ||
      (!category.parentId && !parentId)
    ) {
      const children = buildCategoryTree(categories, category._id);
      if (children.length) {
        category.children = children;
      }
      tree.push(category);
    }
  }

  return tree;
};

// Admin controller
export const addCategory = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    parentId,
    metaTitle,
    metaDescription,
    displayOrder,
  } = req.body;

  // Check if category already exists
  const existingCategory = await Category.findOne({ name: name.toLowerCase() });
  if (existingCategory) {
    throw AppError.conflict(
      "Category with this name already exists",
      "CATEGORY_EXISTS",
    );
  }

  // Handle image upload if provided
  let categoryImage = null;
  if (req.file) {
    const result = await uploadImageToCloudinary(req.file.path, "categories");
    categoryImage = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Create category
  const category = await Category.create({
    name,
    description,
    parentId: parentId || null,
    displayOrder: displayOrder || 0,
    categoryImage,
    metaTitle: metaTitle || name,
    metaDescription: metaDescription || description?.substring(0, 160),
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const {
    name,
    description,
    parentId,
    isActive,
    displayOrder,
    metaTitle,
    metaDescription,
  } = req.body;

  // Find existing category
  const category = await Category.findById(categoryId);
  if (!category) {
    throw AppError.notFound("Category not found", "NOT_FOUND");
  }

  // Check for duplicate name (excluding current category)
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
  }

  // Handle image update
  let categoryImage = category.categoryImage;
  if (req.file) {
    // Delete old image if exists
    if (category.categoryImage?.publicId) {
      await deleteImageFromCloudinary(category.categoryImage.publicId);
    }
    // Upload new image
    const result = await uploadImageToCloudinary(req.file.path, "categories");
    categoryImage = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Check for circular parent reference
  if (parentId === categoryId) {
    throw AppError.badRequest(
      "Category cannot be its own parent",
      "CIRCULAR_PARENT_REFERENCE",
    );
  }

  const oldParentId = category.parentId?.toString();

  // Apply updates
  if (name !== undefined) category.name = name;
  if (description !== undefined) category.description = description;
  if (parentId !== undefined) category.parentId = parentId;
  if (isActive !== undefined) category.isActive = isActive;
  if (displayOrder !== undefined) category.displayOrder = displayOrder;
  if (metaTitle !== undefined) category.metaTitle = metaTitle;
  if (metaDescription !== undefined) category.metaDescription = metaDescription;

  if (categoryImage !== undefined) {
    category.categoryImage = categoryImage;
  }

  // Save (this regenerates slug + path)
  await category.save();

  // 🔥 IMPORTANT: check AFTER save
  if (
    name !== undefined ||
    (parentId !== undefined && parentId !== oldParentId)
  ) {
    await category.updateChildrenPaths();
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // Find category
  const category = await Category.findById(categoryId);

  if (!category) {
    throw AppError.notFound("Category not found", "NOT_FOUND");
  }

  // Check if category has children
  const hasChildren = await Category.exists({ parentId: categoryId });
  if (hasChildren) {
    throw AppError.badRequest(
      "Cannot delete category with subcategories. Delete or reassign subcategories first.",
      "HAS_CHILDREN",
    );
  }

  // Delete image from cloudinary if exists
  if (category.categoryImage?.publicId) {
    await deleteImageFromCloudinary(category.categoryImage.publicId);
  }

  // Delete category
  await Category.findByIdAndDelete(categoryId);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
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

export const getCategoryDetails = asyncHandler(async (req, res) => {
  const { categoryIdOrSlug } = req.params;

  let query = { isActive: true };

  // Check if identifier is ObjectId
  if (mongoose.Types.ObjectId.isValid(categoryIdOrSlug)) {
    query.$or = [{ _id: categoryIdOrSlug }, { slug: categoryIdOrSlug }];
  } else {
    query.slug = categoryIdOrSlug;
  }

  const category = await Category.findOne(query)
    .populate("parentId", "name slug path categoryImage description")
    .lean();

  if (!category) {
    throw AppError.notFound("Category not found", "NOT_FOUND");
  }

  const subcategoriesCount = await Category.countDocuments({
    parentId: category._id,
    isActive: true,
  });

  res.status(200).json({
    success: true,
    data: {
      ...category,
      subcategoriesCount,
    },
  });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    isActive,
    level,
    parentId,
    search,
    sortBy = "displayOrder",
    sortOrder = "asc",
  } = req.query;

  // Build filter
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (level !== undefined) filter.level = parseInt(level);
  if (parentId !== undefined)
    filter.parentId = parentId === "null" ? null : parentId;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute queries
  const [categories, total] = await Promise.all([
    Category.find(filter)
      .populate(
        "parentId",
        "name slug path categoryImage description displayOrder",
      )
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Category.countDocuments(filter),
  ]);

  // Build hierarchical tree if no parent filter
  let hierarchicalCategories = categories;
  if (!parentId && parentId !== "null") {
    hierarchicalCategories = buildCategoryTree(categories);
  }

  res.status(200).json({
    success: true,
    data: hierarchicalCategories,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

//users controllers
export const getAllCategoriesController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, parentId } = req.query;

  const filter = {
    isActive: true,
  };
  if (parentId !== undefined)
    filter.parentId = parentId === "null" ? null : parentId;

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute queries
  const [categories, total] = await Promise.all([
    Category.find(filter)
      .populate(
        "parentId",
        "name slug path categoryImage description displayOrder",
      )
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Category.countDocuments(filter),
  ]);

  // Build hierarchical tree if no parent filter
  let hierarchicalCategories = categories;
  if (!parentId && parentId !== "null") {
    hierarchicalCategories = buildCategoryTree(categories);
  }

  res.status(200).json({
    success: true,
    data: hierarchicalCategories,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});
