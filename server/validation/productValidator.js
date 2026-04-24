import { body, query, param } from "express-validator";

export const addProductValidation = [
  body("productTittle")
    .notEmpty()
    .withMessage("Product title is required")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID"),

  body("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Subcategory must be a valid MongoDB ID"),

  body("variants")
    .isArray({ min: 1 })
    .withMessage("At least one variant required"),

  body("variants.*.variantSkuId")
    .notEmpty()
    .withMessage("Variant SKU is required")
    .isString()
    .withMessage("SKU must be string"),

  body("variants.*.variantMrp")
    .notEmpty()
    .withMessage("Variant MRP is required")
    .isNumeric()
    .withMessage("Variant MRP must be a number"),

  body("variants.*.variantSellingPrice")
    .notEmpty()
    .withMessage("Variant Selling Price is required")
    .isNumeric()
    .withMessage("Variant Selling Price must be a number"),

  body("variants.*.variantCostPrice")
    .notEmpty()
    .withMessage("Variant Cost Price is required")
    .isNumeric()
    .withMessage("Variant Cost Price must be a number"),

  body("variants.*.variantAvailableStock")
    .notEmpty()
    .withMessage("Variant Available Stock is required")
    .isNumeric()
    .withMessage("Variant Available Stock must be a number"),

  body("variants.*.variantLowStockAlertStock")
    .notEmpty()
    .withMessage("Variant Low Stock Alert Stock is required")
    .isNumeric()
    .withMessage("Variant Low Stock Alert Stock must be a number"),

  body("variants.*.variantGST")
    .notEmpty()
    .withMessage("Variant GST is required")
    .isNumeric()
    .withMessage("Variant GST must be a number"),
];

export const GetAllProductsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search query must be a string"),

  query("category")
    .optional()
    .isString()
    .withMessage("Category query must be a string"),

  query("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either 'active' or 'inactive'"),

  query("sortBy")
    .optional()
    .isIn([
      "latest",
      "oldest",
      "atoz",
      "ztoa",
      "lowtohigh",
      "hightolow",
      "rating",
      "popularity",
    ])
    .withMessage(
      "sortBy must be one of 'latest', 'oldest', 'atoz', 'ztoa', 'lowtohigh', or 'hightolow' ",
    ),

  query("subcategory")
    .optional()
    .isString()
    .withMessage("Subcategory query must be a string"),
];

export const adminGetProductDetailsValidation = [
  param("idOrSlug")
    .notEmpty()
    .withMessage("Product ID or slug is required")
    .isString()
    .withMessage("Product ID or slug must be a string"),
];

export const adminUpdateProductValidation = [
  body("productTittle")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Product title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ID"),

  body("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Subcategory must be a valid MongoDB ID"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  body("isDraft")
    .optional()
    .isBoolean()
    .withMessage("isDraft must be a boolean"),
];

export const productIdValidation = [
  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),
];

export const adminAddVariantValidation = [
  body("newVariant.variantSkuId")
    .notEmpty()
    .withMessage("Variant SKU is required")
    .isString()
    .withMessage("Variant SKU must be a string"),

  body("newVariant.variantMrp")
    .notEmpty()
    .withMessage("Variant MRP is required")
    .isNumeric()
    .withMessage("Variant MRP must be a number"),

  body("newVariant.variantSellingPrice")
    .notEmpty()
    .withMessage("Variant Selling Price is required")
    .isNumeric()
    .withMessage("Variant Selling Price must be a number"),

  body("newVariant.variantCostPrice")
    .notEmpty()
    .withMessage("Variant cost price is required")
    .isNumeric()
    .withMessage("Variant cost price must be a number"),

  body("newVariant.variantGST")
    .notEmpty()
    .withMessage("Variant GST is required")
    .isNumeric()
    .withMessage("Variant GST must be a number"),

  body("newVariant.variantAvailableStock")
    .notEmpty()
    .withMessage("Variant Available Stock is required")
    .isNumeric()
    .withMessage("Variant Available Stock must be a number"),

  body("newVariant.variantLowStockAlertStock")
    .notEmpty()
    .withMessage("Variant Low Stock Alert Stock is required")
    .isNumeric()
    .withMessage("Variant Low Stock Alert Stock must be a number"),
];

export const productAndVariantIdValidation = [
  param("variantId")
    .notEmpty()
    .withMessage("Variant ID is required")
    .isMongoId()
    .withMessage("Variant ID must be a valid MongoDB ID"),

  param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),
];

export const adminUpdateVariantValidation = [
  body("updates.variantSkuId")
    .optional()
    .isString()
    .withMessage("Variant SKU must be a string"),

  body("updates.variantMrp")
    .optional()
    .isNumeric()
    .withMessage("Variant MRP must be a number"),

  body("updates.variantSellingPrice")
    .optional()
    .isNumeric()
    .withMessage("Variant Selling Price must be a number"),

  body("updates.variantCostPrice")
    .optional()
    .isNumeric()
    .withMessage("Variant cost price must be a number"),

  body("updates.variantGST")
    .optional()
    .isNumeric()
    .withMessage("Variant GST must be a number"),

  body("updates.variantAvailableStock")
    .optional()
    .isNumeric()
    .withMessage("Variant Available Stock must be a number"),

  body("updates.variantLowStockAlertStock")
    .optional()
    .isNumeric()
    .withMessage("Variant Low Stock Alert Stock must be a number"),

  body("updates.variantName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Variant name must be between 3 and 100 characters"),

  body("updates.variantColor")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Variant color must be between 3 and 100 characters"),

  body("updates.variantWeight")
    .optional()
    .isNumeric()
    .withMessage("Variant weight must be a number"),

  body("updates.variantWeightUnit")
    .optional()
    .trim()
    .isIn(["kg", "g", "mg"])
    .withMessage("Variant weight unit must be one of 'kg', 'g', or 'mg'")
    .isLength({ min: 3, max: 100 })
    .withMessage("Variant weight unit must be between 3 and 100 characters"),

  body("updates.isSelected")
    .optional()
    .isBoolean()
    .withMessage("isSelected must be a boolean"),
];

export const adjustStockValidation = [
  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("stockType")
    .notEmpty()
    .withMessage("Stock type is required")
    .isIn(["inStock", "outStock"])
    .withMessage("Stock type must be either 'inStock' or 'outStock'"),
];
