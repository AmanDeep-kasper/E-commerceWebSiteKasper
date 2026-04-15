import { body } from "express-validator";

export const addAddressValidation = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid 10-digit Indian number")
    .customSanitizer((value) => value?.replace(/\s+/g, "")),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail({
      gmail_remove_dots: false,
    }),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Address must be between 2 and 100 characters"),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("state")
    .notEmpty()
    .withMessage("State is required")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("pinCode")
    .notEmpty()
    .withMessage("PIN code is required")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("PIN code must be 6 characters long")
    .matches(/^\d+$/)
    .withMessage("PIN code must contain only digits"),

  body("addressType")
    .notEmpty()
    .withMessage("Address type is required")
    .isIn(["home", "work", "other"])
    .withMessage("Address type must be home, work, or other"),

  body("country")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
];

export const updateAddressValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  body("phone")
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid 10-digit Indian number")
    .customSanitizer((value) => value?.replace(/\s+/g, "")),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail({
      gmail_remove_dots: false,
    }),

  body("address")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Address must be between 2 and 100 characters"),

  body("city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("state")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("pinCode")
    .optional()
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("PIN code must be 6 characters long")
    .matches(/^\d+$/)
    .withMessage("PIN code must contain only digits"),

  body("addressType")
    .optional()
    .isIn(["home", "work", "other"])
    .withMessage("Address type must be home, work, or other"),

  body("country")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
];
