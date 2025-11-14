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
import uploadProductImages from "../middlewares/productMulter.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";
// import { updateProduct } from "../../client/src/redux/cart/productSlice.js";
// import { getAllCategories } from "../controllers/categoryController.js";

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
router.get("/category/:categoryName", getProductByCategory);
router.get("/categories", getAllCategories);
router.get(
  "/category/:categoryName/:subcategoryName",
  getProductsByCategoryAndSubcategory
);

// 🔹 Product detail (by Mongo _id)
router.get("/:id", getProductDetails);

// 🔹 Product detail (by SEO-friendly slug/route)
router.get("/slug/:route", getProductByRoute);

// Category
// router.get("/categories", getAllCategories);

export default router;
