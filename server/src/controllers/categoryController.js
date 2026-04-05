import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// GET /categories
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}, { name: 1, subcategories: 1, _id: 0 })
    .sort({ name: 1 });

  res.status(200).json({ success: true, categories });
});

// sync helper (use inside addProduct)
export const syncCategoryWithProduct = async (categoryName, subcategoryName) => {
  if (!categoryName) return;

  const name = String(categoryName).trim();
  const sub = String(subcategoryName || "").trim();

  const update = { $setOnInsert: { name } };

  // add subcategory only if provided
  if (sub) update.$addToSet = { subcategories: sub };

  await Category.updateOne({ name }, update, { upsert: true });
};