import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
// import {
//   addProduct,
//   adminUploadProductImages,
// } from "../controllers/productController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// router.post("/admin/add-product", authenticate, authorize("admin"), addProduct);

// router.post(
//   "/admin/add-product-images/:productId",
//   authenticate,
//   authorize("admin"),
//   upload.array("images", 10),
//   adminUploadProductImages,
// );

export default router;
