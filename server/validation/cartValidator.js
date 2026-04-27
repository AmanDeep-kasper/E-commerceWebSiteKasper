import { body, param } from "express-validator";

export const addToCartValidation = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),

  body("variantId")
    .notEmpty()
    .withMessage("Variant ID is required")
    .isMongoId()
    .withMessage("Variant ID must be a valid MongoDB ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

export const updateCartValidation = [
  body("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isMongoId()
    .withMessage("Item ID must be a valid MongoDB ID"),

  body("action")
    .notEmpty()
    .withMessage("Action is required")
    .isIn(["inc", "dec"])
    .withMessage("Action must be either 'inc' or 'dec'"),
];

export const removeFromCartValidation = [
  param("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isMongoId()
    .withMessage("Item ID must be a valid MongoDB ID"),
];
