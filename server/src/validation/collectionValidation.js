import { body, param, query } from "express-validator";

export const addCollectionValidation = [
  body("collectionName")
    .notEmpty()
    .withMessage("Collection name is required")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Collection name must be between 3 and 50 characters"),

  body("products")
    .notEmpty()
    .withMessage("Products array is required")
    .isArray()
    .withMessage("Products must be an array")
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error("Products must be an array");
      }
      if (value.length === 0) {
        throw new Error("Products array cannot be empty");
      }
      return true;
    }),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const updateCollectionValidation = [
  body("collectionName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Collection name must be between 3 and 50 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  body("addProducts")
    .optional()
    .isArray()
    .withMessage("addProducts must be an array"),
];

export const addProductToCollectionValidation = [
  body("products")
    .notEmpty()
    .withMessage("Products array is required")
    .isArray()
    .withMessage("Products must be an array"),
];

export const removeProductFromCollectionValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isString()
    .withMessage("Product ID must be a string"),
];

export const collectionIdValidation = [
  param("collectionId")
    .notEmpty()
    .withMessage("Collection ID is required")
    .isMongoId()
    .withMessage("Collection ID must be a valid MongoDB ID"),
];

export const queryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Search query must be between 2 and 50 characters"),

  query("status")
    .optional()
    .isIn(["true", "false"])
    .withMessage("Status must be either true or false"),
];
