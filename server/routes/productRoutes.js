import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductByCategory,
  getProductsByCategoryAndSubcategory,
  getProductDetails, // 🔹 import
  getProductByRoute, // 🔹 import
  getAllCategories,
} from "../controllers/productController.js";
import { uploadProductImages } from "../middlewares/multerConfig.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔐 Admin-only access to product creation

router.post(
  "/add-product",
  isAuthenticated,
  isAdmin,
  uploadProductImages,
  addProduct
);


// router.put(
//   "/update-product/:id",
//   isAuthenticated,
//   isAdmin,
//   uploadProductImages,
//   addProduct,
//   updateProduct
// );

// 🌐 Public access
router.get("/all", getAllProducts);
router.get("/categories", getAllCategories);
router.get("/category/:categoryName", getProductByCategory);
router.get("/category/:categoryName/:subcategoryName", getProductsByCategoryAndSubcategory);

// ✅ move slug before /:id
router.get("/slug/:route", getProductByRoute);
router.get("/:id", getProductDetails);

// Category
// router.get("/categories", getAllCategories);

export default router;
