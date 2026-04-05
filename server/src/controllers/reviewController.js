import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// ✅ Add a new review
export const addReview = asyncHandler(async (req, res) => {
  const { product, rating, comment, images } = req.body;
  const userId = req.user._id; // from auth middleware

  // Check if product exists
  const productExists = await Product.findById(product);
  if (!productExists) {
    throw AppError.notFound("Product not found", "PRODUCT_NOT_FOUND");
  }

  // Prevent duplicate review from same user
  const existingReview = await Review.findOne({ user: userId, product });
  if (existingReview) {
    throw AppError.conflict("You already reviewed this product", "REVIEW_EXISTS");
  }

  // Create review
  const review = await Review.create({
    user: userId,
    product,
    rating,
    comment,
    images,
  });

  // 🔑 Add review ID into product.reviews
  productExists.reviews.push(review._id);
  await productExists.save();

  res.status(201).json({ success: true, review });
});

// ✅ Get all reviews for a product
export const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await Review.find({ product: productId })
    .populate("user", "username email profile")
    .sort({ createdAt: -1 });

  res.json({ success: true, reviews });
});

// ✅ Get single review
export const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate(
    "user",
    "username email"
  );
  if (!review) {
    throw AppError.notFound("Review not found", "REVIEW_NOT_FOUND");
  }

  res.json({ success: true, review });
});

// ✅ Update review (only by review owner)
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw AppError.notFound("Review not found", "REVIEW_NOT_FOUND");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw AppError.authorization(
      "Not authorized",
      "NOT_AUTHORIZED"
    );
  }

  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;
  review.images = req.body.images || review.images;

  await review.save();

  res.json({ success: true, review });
});

// // ✅ Delete review (only by review owner or admin)
// export const deleteReview = asyncHandler(async (req, res) => {
//   const review = await Review.findById(req.params.id);
//   if (!review) {
//     throw AppError.notFound("Review not found", "REVIEW_NOT_FOUND");
//   }

//   if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
//     throw AppError.authorization(
//       "Not authorized",
//       "NOT_AUTHORIZED"
//     );
//   }

//   await Review.findByIdAndDelete(req.params.id);

//   // Remove review from product
//   await Product.findByIdAndUpdate(review.product, {
//     $pull: { reviews: review._id },
//   });

//   res.json({ success: true, message: "Review deleted" });
//    review.rating = req.body.rating || review.rating;
//     review.comment = req.body.comment || review.comment;
//     review.images = req.body.images || review.images;

//     await review.save();

//     res.json({ success: true, review });
// });
    

   
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }


// ✅ Like review
export const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const userId = req.user._id.toString();

    // If already liked → remove like
    if (review.likes.includes(userId)) {
      review.likes.pull(userId);
    } else {
      // Remove from dislikes if user disliked before
      review.dislikes.pull(userId);
      review.likes.push(userId);
    }

    await review.save();
    res.json({
      success: true,
      likes: review.likes.length,
      dislikes: review.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Dislike review
export const dislikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const userId = req.user._id.toString();

    // If already disliked → remove dislike
    if (review.dislikes.includes(userId)) {
      review.dislikes.pull(userId);
    } else {
      // Remove from likes if user liked before
      review.likes.pull(userId);
      review.dislikes.push(userId);
    }

    await review.save();
    res.json({ success: true, likes: review.likes.length, dislikes: review.dislikes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

