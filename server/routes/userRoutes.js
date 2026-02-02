import express from "express";
import {
  getUserDetails,
  updateUserDetails,
  updateUserEmail,
  updateUserProfileImage
} from "../controllers/UserController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

// ✅ Named import
import { uploadProfileImage } from "../middlewares/multerConfig.js";

const router = express.Router();

router.get("/me", isAuthenticated, getUserDetails);
router.put("/me", isAuthenticated, updateUserDetails);

router.patch(
  "/me/profile-image",
  isAuthenticated,
  uploadProfileImage,   
  updateUserProfileImage  
);

router.patch("/me/update-email", isAuthenticated, updateUserEmail);

export default router;
