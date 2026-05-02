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
  // newone
   addReplyToReview,
  updateReply,
  deleteReply,
  getReviewReplies,
} from "../controllers/reviewController.js";
import { validateRequest } from "../validation/validator.js";
import {
  addReviewValidation,
  updateReviewValidation,
  reviewIdValidation,
  getAllUserReviewsValidation,
  getAllProductReviewsValidation,
} from "../validation/reviewValidation.js";

const router = express.Router();

router.post(
  "/add-review/:productId",
  authenticate,
  authorize("user"),
  upload.array("reviewImages", 5),
  addReviewValidation,
  validateRequest,
  addReview,
);

router.get(
  "/get-review/:reviewId",
  authenticate,
  authorize("user"),
  reviewIdValidation,
  validateRequest,
  getReview,
);

router.delete(
  "/delete-review/:reviewId",
  authenticate,
  authorize("user"),
  reviewIdValidation,
  validateRequest,
  deleteReview,
);

router.get(
  "/all-product-reviews/:productId",
  getAllProductReviewsValidation,
  validateRequest,
  getAllProductReviews,
);

router.get(
  "/get-user-reviews",
  authenticate,
  authorize("user"),
  getAllUserReviewsValidation,
  validateRequest,
  getAllUserReviews,
);

router.patch(
  "/update-review/:reviewId",
  authenticate,
  authorize("user"),
  upload.array("reviewImages", 5),
  updateReviewValidation,
  validateRequest,
  updateReview,
);
router.post(
  "/add-reply/:reviewId",
  authenticate,
  authorize("admin", "seller"),
  addReplyToReview
);

router.patch(
  "/update-reply/:reviewId/:replyId",
  authenticate,
  authorize("admin", "seller"),
  updateReply
);

router.delete(
  "/delete-reply/:reviewId/:replyId",
  authenticate,
  authorize("admin", "seller"),
  deleteReply
);

router.get(
  "/get-replies/:reviewId",
  getReviewReplies
);

export default router;
