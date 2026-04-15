import { body, query, param } from "express-validator";

export const addReviewValidation = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("reviewText")
    .notEmpty()
    .withMessage("Review text is required")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Review text must be between 10 and 2000 characters"),

  body("reviewImages")
    .optional()
    .isArray()
    .withMessage("Review images must be an array"),

  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),
];

export const updateReviewValidation = [
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("reviewText")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Review text must be between 10 and 2000 characters"),

  body("removeImages")
    .optional()
    .isArray()
    .withMessage("Remove images must be an array"),
];

export const reviewIdValidation = [
  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required")
    .isMongoId()
    .withMessage("Review ID must be a valid MongoDB ID"),
];

export const getAllUserReviewsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
];

export const getAllProductReviewsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  query("sortBy")
    .optional()
    .isIn(["mostRecent", "mostOldest", "highestRated", "lowestRated"])
    .withMessage("Invalid sortBy value"),

  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),
];
