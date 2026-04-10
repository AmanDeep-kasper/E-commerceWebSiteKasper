import { body, param } from "express-validator";

export const updateUserDetailsValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Name can only contain letters, spaces, hyphens, and apostrophes",
    ),

  body("dob")
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage("DOB must be in DD-MM-YYYY format")
    .custom((value) => {
      const [day, month, year] = value.split("-").map(Number);

      const date = new Date(year, month - 1, day);

      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {
        throw new Error("Invalid date");
      }

      if (date >= new Date()) {
        throw new Error("DOB must be in the past");
      }

      return true;
    }),
  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("phoneNumber")
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Phone number must be a valid 10-digit Indian number")
    .customSanitizer((value) => value?.replace(/\s+/g, "")),
];

export const updateUserEmailValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail({
      gmail_remove_dots: false,
    })
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    .withMessage("Please provide a valid email address"),
];

export const otpValidation = [
  body("tempUserId")
    .notEmpty()
    .withMessage("Temp User ID is required")
    .trim()
    .isMongoId()
    .withMessage("Please provide a valid temp user ID"),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 characters long")
    .matches(/^\d+$/)
    .withMessage("OTP must contain only digits"),
];

export const userIdQueryParamValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .trim()
    .isMongoId()
    .withMessage("Please provide a valid user ID"),
];
