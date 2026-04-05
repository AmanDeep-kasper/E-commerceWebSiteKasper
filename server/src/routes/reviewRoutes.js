import express from "express";
import {
  addReview,
  getProductReviews,
  getReview,
  updateReview,
  deleteReview,
  likeReview,
  dislikeReview,
} from "../controllers/reviewController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Public routes
router.get("/product/:productId", getProductReviews);
router.get("/:id", getReview);

// ✅ isAuthenticateded routes
router.post("/", isAuthenticated, addReview);
router.put("/:id", isAuthenticated, updateReview);
router.delete("/:id", isAuthenticated, deleteReview);

// ✅ Like/Dislike
router.put("/:id/like", isAuthenticated, likeReview);
router.put("/:id/dislike", isAuthenticated, dislikeReview);

export default router;
