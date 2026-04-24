import { body, param, query } from "express-validator";

export const addTransporterValidation = [
  body("transporterName")
    .notEmpty()
    .withMessage("Transporter name is required"),

  body("registrationNumber")
    .notEmpty()
    .withMessage("Registration number is required"),

  body("trackingUrl")
    .notEmpty()
    .withMessage("Tracking url is required")
    .isString()
    .withMessage("Tracking url must be a string"),

  body("contactDetails")
    .notEmpty()
    .withMessage("Contact details are required")
    .isObject()
    .withMessage("Contact details must be an object"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

export const getTransportersValidation = [
  query("search")
    .optional()
    .isString()
    .withMessage("Search query must be a string"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  query("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either 'active' or 'inactive'"),

  query("sortBy")
    .optional()
    .isIn(["latest", "oldest", "az", "za"])
    .withMessage("sortBy must be either 'latest', 'oldest', 'az', or 'za'"),
];

export const updateTransporterValidation = [
  param("transporterId")
    .notEmpty()
    .withMessage("Transporter id is required")
    .isMongoId()
    .withMessage("Transporter id must be a valid mongo id"),

  body("transporterName")
    .optional()
    .isString()
    .withMessage("Transporter name must be a string"),

  body("trackingUrl")
    .optional()
    .isString()
    .withMessage("Tracking url must be a string"),

  body("contactDetails")
    .optional()
    .isObject()
    .withMessage("Contact details must be an object"),
];

export const toggleOrGetTransporterValidation = [
  param("transporterId")
    .notEmpty()
    .withMessage("Transporter id is required")
    .isMongoId()
    .withMessage("Transporter id must be a valid mongo id"),
];
