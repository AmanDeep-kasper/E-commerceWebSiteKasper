import Category from "../models/Category.js";

// GET /categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { name: 1, subcategories: 1, _id: 0 })
      .sort({ name: 1 });

    return res.status(200).json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

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