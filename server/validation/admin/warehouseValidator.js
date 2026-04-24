import { body } from "express-validator";

export const addWarehouseValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Name must be at most 50 characters long")
    .trim(),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .matches(/^\d{10}$/, "i")
    .withMessage("Invalid phone number format"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isObject()
    .withMessage("Address must be an object"),
];

export const updateWarehouseValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .isLength({ max: 50 })
    .withMessage("Name must be at most 50 characters long")
    .trim(),

  body("phone")
    .optional()
    .matches(/^\d{10}$/, "i")
    .withMessage("Invalid phone number format"),

  body("email").optional().isEmail().withMessage("Invalid email format"),

  body("address")
    .optional()
    .isObject()
    .withMessage("Address must be an object"),
];
