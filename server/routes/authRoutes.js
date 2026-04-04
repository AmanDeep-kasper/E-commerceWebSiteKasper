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
import { validateReqest } from "../validation/validator.js";
import { upload } from "../middlewares/multer.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  validateReqest,
  registerValidation,
  registerUser,
);
router.post("/verify", validateReqest, otpValidation, verifyOTP);
router.post("/login", validateReqest, loginValidation, loginUser);
router.post("/logout", authenticate, logoutUser);
router.get("/me", authenticate, me);
router.patch(
  "/change-password",
  validateReqest,
  changePasswordValidation,
  authenticate,
  changePassword,
);
router.post(
  "/forgot-password",
  validateReqest,
  forgotPasswordValidation,
  forgotPassword,
);
router.post(
  "/reset-password/:token",
  validateReqest,
  resetPasswordValidation,
  resetPassword,
);

router.post("/refresh-token", refreshAccessToken);

export default router;
