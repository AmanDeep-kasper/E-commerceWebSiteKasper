import express from "express";
import { authenticate, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multer.js";
import {
  addReview,
  deleteReview,
  getAllProductReviews,
  getReview,
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

export default router;
