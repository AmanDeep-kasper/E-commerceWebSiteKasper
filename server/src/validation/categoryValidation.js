import { body } from "express-validator";
import mongoose from "mongoose";

export const addCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters")
    .matches(/^[a-z\s-]+$/i)
    .withMessage("Category name can only contain letters, spaces, and hyphens")
    .trim(),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim(),

  body("parentId")
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Parent ID");
      }
      return true;
    }),

  body("metaTitle")
    .optional()
    .isString()
    .withMessage("Meta Title must be a string")
    .trim(),

  body("metaDescription")
    .optional()
    .isString()
    .withMessage("Meta Description must be a string")
    .trim(),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display Order must be a non-negative integer"),
];

export const updateCategoryValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Category name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters")
    .matches(/^[a-z\s-]+$/i)
    .withMessage("Category name can only contain letters, spaces, and hyphens")
    .trim(),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim(),

  body("parentId")
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Invalid Parent ID");
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  body("displayOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Display Order must be a non-negative integer"),

  body("metaTitle")
    .optional()
    .isString()
    .withMessage("Meta Title must be a string")
    .trim(),

  body("metaDescription")
    .optional()
    .isString()
    .withMessage("Meta Description must be a string")
    .trim(),
];
