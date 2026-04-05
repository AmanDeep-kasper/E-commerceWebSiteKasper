import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  getUserDetails,
  updateUserDetails,
  updateUserEmail,
  updateUserProfileImage,
  verifyOTP,
} from "../controllers/userController.js";
import { validateRequest } from "../validation/validator.js";
import {
  otpValidation,
  updateUserDetailsValidation,
  updateUserEmailValidation,
} from "../validation/userValidation.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/details", authenticate, getUserDetails);

router.patch(
  "/update-details",
  authenticate,
  updateUserDetailsValidation,
  validateRequest,
  updateUserDetails,
);

router.patch(
  "/update-profile-image",
  authenticate,
  (req, res, next) => {
    req.uploadFolder = "profile";
    next();
  },
  upload.single("profileImage"),
  updateUserProfileImage,
);

router.post(
  "/update-email",
  authenticate,
  updateUserEmailValidation,
  validateRequest,
  updateUserEmail,
);

router.post(
  "/verify-otp",
  authenticate,
  otpValidation,
  validateRequest,
  verifyOTP,
);

export default router;
