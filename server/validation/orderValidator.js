import { body, param, query } from "express-validator";

export const checkoutSummaryValidator = [
  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required")
    .isObject()
    .withMessage("Shipping address must be an object"),

  body("appliedPoints")
    .optional()
    .isNumeric()
    .withMessage("Applied points must be a number"),
];

export const checkoutValidator = [
  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["razorpay"])
    .withMessage("Invalid payment method"),

  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required")
    .isObject()
    .withMessage("Shipping address must be an object"),

  body("appliedPoints")
    .optional()
    .isNumeric()
    .withMessage("Applied points must be a number"),
];

export const verifyPaymentValidator = [
  body("razorpayOrderId")
    .notEmpty()
    .withMessage("Razorpay order id is required"),

  body("razorpayPaymentId")
    .notEmpty()
    .withMessage("Razorpay payment id is required"),

  body("razorpaySignature")
    .notEmpty()
    .withMessage("Razorpay signature is required"),
];

export const paymentFailedValidator = [
  body("razorpayPaymentId")
    .notEmpty()
    .withMessage("Razorpay payment id is required"),

  body("razorpayOrderId")
    .notEmpty()
    .withMessage("Razorpay order id is required"),

  body("error")
    .notEmpty()
    .withMessage("Error is required")
    .isObject()
    .withMessage("Error must be an object"),
];

export const getOrdersValidator = [
  query("page")
    .optional()
    .isNumeric()
    .withMessage("Page must be a number")
    .length({ min: 1 })
    .withMessage("Page must be greater than 0"),

  query("limit")
    .optional()
    .isNumeric()
    .withMessage("Limit must be a number")
    .length({ min: 1 })
    .withMessage("Limit must be greater than 0"),

  query("search").optional().isString().withMessage("Search must be a string"),

  query("range")
    .optional()
    .isIn(["30d", "6m", "1y"])
    .withMessage("Invalid range"),

  query("year").optional().isNumeric().withMessage("Year must be a number"),

  query("sortBy")
    .optional()
    .isIn(["oldest", "latest", "price-high", "price-low"])
    .withMessage("Invalid sort by"),
];

export const orderIdValidator = [
  param("orderId")
    .notEmpty()
    .withMessage("Order id is required")
    .isMongoId()
    .withMessage("Invalid order id"),
];

export const shipOrderValidator = [
  body("carrier")
    .notEmpty()
    .withMessage("Carrier is required")
    .isString()
    .withMessage("Carrier must be a string"),

  body("trackingNumber")
    .notEmpty()
    .withMessage("Tracking number is required")
    .isString()
    .withMessage("Tracking number must be a string"),

  body("trackingUrl")
    .notEmpty()
    .withMessage("Tracking url is required")
    .isString()
    .withMessage("Tracking url must be a string"),
];
