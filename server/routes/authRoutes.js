import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
  logoutUser,
  me,
  changePassword,
  refreshAccessToken,
  resendOTP,
} from "../controllers/authController.js";
import {
  registerValidation,
  otpValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "../validation/authValidation.js";
import { validateRequest } from "../validation/validator.js";
import { upload } from "../middlewares/multer.js";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
// import {
//   loginLimiter,
//   sensitiveLimiter,
//   generalLimiter,
// } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  registerValidation,
  validateRequest,
  registerUser,
);

router.post("/resend-otp", /*sensitiveLimiter,*/ resendOTP);
router.post(
  "/verify",
  // sensitiveLimiter,
  otpValidation,
  validateRequest,
  verifyOTP,
);
router.post(
  "/login",
  // loginLimiter,
  loginValidation,
  validateRequest,
  loginUser,
);
router.post("/logout", /*generalLimiter,*/ authenticate, logoutUser);
router.get("/me", /*generalLimiter,*/ authenticate, me);

router.patch(
  "/change-password",
  // generalLimiter,
  authenticate,
  authorize("user"),
  changePasswordValidation,
  validateRequest,
  changePassword,
);

router.post(
  "/forgot-password",
  // sensitiveLimiter,
  forgotPasswordValidation,
  validateRequest,
  forgotPassword,
);
router.post(
  "/reset-password/:token",
  // sensitiveLimiter,
  resetPasswordValidation,
  validateRequest,
  resetPassword,
);

router.post("/refresh-token", /*generalLimiter,*/ refreshAccessToken);

export default router;
