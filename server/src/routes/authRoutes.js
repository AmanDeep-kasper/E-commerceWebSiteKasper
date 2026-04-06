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

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  registerValidation,
  validateRequest,
  registerUser,
);
router.post("/verify", otpValidation, validateRequest, verifyOTP);
router.post("/login", loginValidation, validateRequest, loginUser);
router.post("/logout", authenticate, logoutUser);
router.get("/me", authenticate, me);
router.patch(
  "/change-password",
  authenticate,
  authorize("user"),
  changePasswordValidation,
  validateRequest,
  changePassword,
);
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validateRequest,
  forgotPassword,
);
router.post(
  "/reset-password/:token",
  resetPasswordValidation,
  validateRequest,
  resetPassword,
);

router.post("/refresh-token", refreshAccessToken);

export default router;
