import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getAllCategoriesController,
  getCategoryDetails,
  getCategoryDetailsController,
  updateCategory,
  updateCategoryStatus,
} from "../controllers/categoryController.js";
import { validateRequest } from "../validation/validator.js";
import {
  addCategoryValidation,
  updateCategoryValidation,
} from "../validation/categoryValidation.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// admin routes
router.post(
  "/admin/add-category",
  authenticate,
  authorize("admin"),
  upload.single("categoryImage"),
  addCategoryValidation,
  validateRequest,
  addCategory,
);

router.get(
  "/admin/all-categories",
  authenticate,
  authorize("admin"),
  getAllCategories,
);

router.put(
  "/admin/update-category/:categoryId",
  authenticate,
  authorize("admin"),
  upload.single("categoryImage"),
  updateCategoryValidation,
  validateRequest,
  updateCategory,
);

router.delete(
  "/admin/delete-category/:categoryId",
  authenticate,
  authorize("admin"),
  deleteCategory,
);

router.patch(
  "/admin/status/:categoryId",
  authenticate,
  authorize("admin"),
  updateCategoryStatus,
);

router.get(
  "/admin/detail/:categoryIdOrSlug",
  authenticate,
  authorize("admin"),
  getCategoryDetails,
);

// /users routes
router.get("/all-categories", getAllCategoriesController);

router.get("/detail/:categoryIdOrSlug", getCategoryDetailsController);

export default router;
