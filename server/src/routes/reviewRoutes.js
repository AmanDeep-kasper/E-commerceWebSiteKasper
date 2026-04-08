import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";
import {
  addReview,
  deleteReview,
  getAllProductReviews,
  getAllUserReviews,
  getReview,
  updateReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post(
  "/add-review/:productId",
  authenticate,
  authorize("user"),
  upload.array("reviewImages", 5),
  addReview,
);

router.get("/get-review/:reviewId", authenticate, authorize("user"), getReview);

router.delete(
  "/delete-review/:reviewId",
  authenticate,
  authorize("user"),
  deleteReview,
);

router.get("/all-product-reviews/:productId", getAllProductReviews);

router.get(
  "/get-user-reviews",
  authenticate,
  authorize("user"),
  getAllUserReviews,
);

router.patch(
  "/update-review/:reviewId",
  authenticate,
  authorize("user"),
  upload.array("reviewImages", 5),
  updateReview,
);

export default router;
