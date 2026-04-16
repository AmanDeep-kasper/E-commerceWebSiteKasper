import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  getUserDetails,
  sendSupportMessage,
  updateStatus,
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
  userIdQueryParamValidation,
} from "../validation/userValidation.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/detail", authenticate, getUserDetails);
router.post("/send-support-message", authenticate, sendSupportMessage);

router.patch(
  "/update-detail",
  authenticate,
  updateUserDetailsValidation,
  validateRequest,
  updateUserDetails,
);

router.patch(
  "/update-profile-image",
  authenticate,
  (req, _res, next) => {
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

// Admin routes

router.get("/admin/all-users", authenticate, authorize("admin"), getAllUsers);

router.get(
  "/admin/detail/:userId",
  authenticate,
  authorize("admin"),
  userIdQueryParamValidation,
  validateRequest,
  getUserById,
);

router.delete(
  "/admin/delete/:userId",
  authenticate,
  authorize("admin"),
  userIdQueryParamValidation,
  validateRequest,
  deleteUser,
);

router.patch(
  "/admin/status/:userId",
  authenticate,
  authorize("admin"),
  userIdQueryParamValidation,
  validateRequest,
  updateStatus,
);

export default router;
