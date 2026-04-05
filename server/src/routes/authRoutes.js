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
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  validateRequest,
  registerValidation,
  registerUser,
);
router.post("/verify", validateRequest, otpValidation, verifyOTP);
router.post("/login", validateRequest, loginValidation, loginUser);
router.post("/logout", authenticate, logoutUser);
router.get("/me", authenticate, me);
router.patch(
  "/change-password",
  validateRequest,
  changePasswordValidation,
  authenticate,
  changePassword,
);
router.post(
  "/forgot-password",
  validateRequest,
  forgotPasswordValidation,
  forgotPassword,
);
router.post(
  "/reset-password/:token",
  validateRequest,
  resetPasswordValidation,
  resetPassword,
);

router.post("/refresh-token", refreshAccessToken);

export default router;
