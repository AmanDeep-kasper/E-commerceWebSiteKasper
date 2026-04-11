import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  addProduct,
  adminGetAllProducts,
  adminGetProductDetails,
  adminUpdateProduct,
  deleteVariantImages,
  uploadVariantsImages,
  // adminUploadProductImages,
} from "../controllers/productController.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Admin routes
router.post(
  "/admin/add-product-images",
  authenticate,
  authorize("admin"),
  upload.array("productImages", 10),
  uploadVariantsImages,
);

router.delete(
  "/admin/delete-product-image/:publicId",
  authenticate,
  authorize("admin"),
  deleteVariantImages,
);

router.post("/admin/add-product", authenticate, authorize("admin"), addProduct);

router.get(
  "/admin/get-all-products",
  authenticate,
  authorize("admin"),
  adminGetAllProducts,
);

router.get(
  "/admin/get-product-details/:idOrSlug",
  authenticate,
  authorize("admin"),
  adminGetProductDetails,
);

router.patch(
  "/admin/update-product/:productId",
  authenticate,
  authorize("admin"),
  adminUpdateProduct,
);

export default router;
