import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  createOrUpdateCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategories,
  getAllCategoriesController,
  getAllSubCategories,
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
  "/admin/createOrUpdate-category",
  authenticate,
  authorize("admin"),
  (req, _res, next) => {
    req.uploadFolder = "category";
    next();
  },
  upload.single("categoryImage"),
  addCategoryValidation,
  validateRequest,
  createOrUpdateCategory,
);

router.get(
  "/admin/all-categories",
  authenticate,
  authorize("admin"),
  getAllCategories,
);

router.get(
  "/admin/category-detail/:categoryIdOrSlug",
  authenticate,
  authorize("admin"),
  getCategoryDetails,
);

router.patch(
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

router.delete(
  "/admin/delete-subcategory/:subCategoryId",
  authenticate,
  authorize("admin"),
  deleteSubCategory,
);

// /users routes
router.get("/all-categories", getAllCategoriesController);

router.get("/detail/:categoryIdOrSlug", getCategoryDetailsController);

router.get("/all-subcategory", getAllSubCategories);

export default router;
