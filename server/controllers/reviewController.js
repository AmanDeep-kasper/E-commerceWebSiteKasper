import Review from "../models/Review.js";
import Product from "../models/Product.js";
import BusinessSetting from "../models/admin/BusinessConfig.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploader.js";

export const addReview = asyncHandler(async (req, res) => {
  const { rating, reviewText } = req.body;
  const { productId } = req.params;
  const userId = req.user?.userId;

  const product = await Product.findById(productId);

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  // check duplicate review on same product
  const existingReview = await Review.findOne({
    productId,
    userId,
  });

  if (existingReview) {
    throw AppError.conflict(
      "You have already reviewed this product",
      "DUPLICATE_REVIEW",
    );
  }

  // upload images to cloudinary
  const uploadedImages = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const resourceType = file.mimetype.startsWith("video")
        ? "video"
        : "image";

      const result = await uploadToCloudinary(
        file.buffer,
        resourceType,
        resourceType === "image" ? "review-images" : "review-videos",
        file.originalname,
      );

      uploadedImages.push({
        url: result.url,
        publicId: result.publicId,
      });
    }
  }
  // create review
  const review = await Review.create({
    productId,
    userId,
    reviewerName: req.user?.name,
    rating,
    reviewText,
    reviewImages: uploadedImages,
  });

  // update product total review count and avgRating
  product.stats.totalReviews += 1;
  product.stats.averageRating = Number(
    (product.stats.averageRating * (product.stats.totalReviews - 1) +
      review.rating) /
      product.stats.totalReviews,
  ).toFixed(1);

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: review,
  });
});

export const getAllUserReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const userId = req.user?.userId;

  const skip = (page - 1) * limit;

  const reviews = await Review.find({ userId })
    .populate("productId", "productTittle variants.variantImage")
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Review.countDocuments({ userId });

  // ✅ extract only first image
  const formattedReviews = reviews.map((review) => {
    const product = review.productId;

    const firstImage = product?.variants?.[0]?.variantImage?.[0]?.url || null;

    return {
      ...review,
      productId: {
        _id: product?._id,
        productTittle: product?.productTittle,
        image: firstImage,
      },
    };
  });

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    data: formattedReviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

// export const getAllProductReviews = asyncHandler(async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 20;
//   const { sortBy } = req.query;
//   const { productId } = req.params;

//   const skip = (page - 1) * limit;

//   let sort = { createdAt: -1 };

//   if (sortBy === "mostOldest") {
//     sort = { createdAt: 1 };
//   } else if (sortBy === "highestRated") {
//     sort = { rating: -1, createdAt: -1 };
//   } else if (sortBy === "lowestRated") {
//     sort = { rating: 1, createdAt: -1 };
//   }

//   const reviews = await Review.find({ productId })
//     .sort(sort)
//     .skip(skip)
//     .limit(limit)
//     .lean();

//   res.status(200).json({
//     success: true,
//     message: "Reviews fetched successfully",
//     data: reviews,
//   });
// });

export const getAllProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const { sortBy } = req.query;
  const { productId } = req.params;

  const skip = (page - 1) * limit;

  let sort = { createdAt: -1 };

  if (sortBy === "mostOldest") sort = { createdAt: 1 };
  else if (sortBy === "highestRated") sort = { rating: -1, createdAt: -1 };
  else if (sortBy === "lowestRated") sort = { rating: 1, createdAt: -1 };

  const [reviews, business] = await Promise.all([
    Review.find({ productId }).sort(sort).skip(skip).limit(limit).lean(),

    BusinessSetting.findOne({ isActive: true })
      .select("businessName logo.url")
      .lean(),
  ]);

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    business,
    data: reviews,
  });
});

export const getReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId).lean();

  if (!review) {
    throw AppError.notFound("Review not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Review fetched successfully",
    data: review,
  });
});

export const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, reviewText, removeImages } = req.body;

  const review = await Review.findById(reviewId).populate(
    "productId",
    "productTittle variants.variantImage",
  );

  if (!review) {
    throw AppError.notFound("Review not found", "NOT_FOUND");
  }

  const product = await Product.findById(review.productId);

  // Ownership check
  if (!req.user?.userId) {
    throw AppError.unauthorized("User not authenticated");
  }

  // Update fields
  if (rating !== undefined) review.rating = rating;
  if (reviewText !== undefined) review.reviewText = reviewText;

  // update product stats
  if (product.stats.totalReviews === 1) {
    product.stats.averageRating = 0;
    product.stats.totalReviews = 0;
  } else {
    product.stats.averageRating = Number(
      (
        (product.stats.averageRating * product.stats.totalReviews -
          review.rating) /
        (product.stats.totalReviews - 1)
      ).toFixed(1),
    );

    product.stats.totalReviews -= 1;
  }
  // DELETE MULTIPLE IMAGES
  if (removeImages && Array.isArray(removeImages)) {
    // delete from cloudinary (parallel for speed)
    await Promise.all(
      removeImages.map((publicId) => deleteFromCloudinary(publicId)),
    );

    // remove from DB
    review.reviewImages = review.reviewImages.filter(
      (img) => !removeImages.includes(img.publicId),
    );
  }

  // ADD MULTIPLE IMAGES
  if (req.files && req.files.length > 0) {
    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(
          file.buffer,
          file.mimetype.startsWith("video") ? "video" : "image",
          file.mimetype.startsWith("video") ? "review-videos" : "review-images",
          file.originalname,
        ),
      ),
    );

    const formattedImages = uploadedImages.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    }));

    review.reviewImages.push(...formattedImages);
  }

  await review.save();

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    throw AppError.notFound("Review not found", "NOT_FOUND");
  }

  // check user eligibility
  if (!req.user?.userId) {
    throw AppError.unauthorized("User not authenticated");
  }
  const product = await Product.findById(review.productId);

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  // recalculate totalReview count and avgRating of product
  if (product.stats.totalReviews === 1) {
    product.stats.averageRating = 0;
    product.stats.totalReviews = 0;
  } else {
    product.stats.averageRating = Number(
      (
        (product.stats.averageRating * product.stats.totalReviews -
          review.rating) /
        (product.stats.totalReviews - 1)
      ).toFixed(1),
    );

    product.stats.totalReviews -= 1;
  }

  await product.save();

  // delete images from cloudinary if exist
  if (review.reviewImages) {
    for (const image of review.reviewImages) {
      await deleteFromCloudinary(image.publicId);
    }
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});


// Add these functions to your reviewController.js

// Add a reply to a review (Admin/Seller only)
export const addReplyToReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { replyText } = req.body;
  const userId = req.user?.userId;
  const userRole = req.user?.role;
  const userName = req.user?.name;

  // Check if user is admin or seller (authorized to reply)
  if (userRole !== "admin" && userRole !== "seller") {
    throw new AppError("Only admins and sellers can reply to reviews", 403, "FORBIDDEN");
  }

  if (!replyText || replyText.trim() === "") {
    throw new AppError("Reply text is required", 400, "MISSING_REPLY_TEXT");
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404, "NOT_FOUND");
  }

  // Add reply
  review.replies.push({
    userId,
    reviewerName: userName || (userRole === "admin" ? "Admin" : "Seller"),
    replyText: replyText.trim(),
    createdAt: new Date(),
    updatedAt: new Date()
  });

  review.adminReplied = true;
  await review.save();

  res.status(200).json({
    success: true,
    message: "Reply added successfully",
    data: review.replies[review.replies.length - 1]
  });
});

// Update a reply
export const updateReply = asyncHandler(async (req, res) => {
  const { reviewId, replyId } = req.params;
  const { replyText } = req.body;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404, "NOT_FOUND");
  }

  const reply = review.replies.id(replyId);

  if (!reply) {
    throw new AppError("Reply not found", 404, "NOT_FOUND");
  }

  // Check ownership or admin role
  if (reply.userId.toString() !== userId && userRole !== "admin") {
    throw new AppError("You can only edit your own replies", 403, "FORBIDDEN");
  }

  reply.replyText = replyText.trim();
  reply.updatedAt = new Date();
  
  await review.save();

  res.status(200).json({
    success: true,
    message: "Reply updated successfully",
    data: reply
  });
});

// Delete a reply
export const deleteReply = asyncHandler(async (req, res) => {
  const { reviewId, replyId } = req.params;
  const userId = req.user?.userId;
  const userRole = req.user?.role;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404, "NOT_FOUND");
  }

  const reply = review.replies.id(replyId);

  if (!reply) {
    throw new AppError("Reply not found", 404, "NOT_FOUND");
  }

  // Check ownership or admin role
  if (reply.userId.toString() !== userId && userRole !== "admin") {
    throw new AppError("You can only delete your own replies", 403, "FORBIDDEN");
  }

  review.replies.pull(replyId);
  
  // If no replies left, set adminReplied to false
  if (review.replies.length === 0) {
    review.adminReplied = false;
  }
  
  await review.save();

  res.status(200).json({
    success: true,
    message: "Reply deleted successfully"
  });
});

// Get all replies for a review
export const getReviewReplies = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId).select('replies');

  if (!review) {
    throw new AppError("Review not found", 404, "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Replies fetched successfully",
    data: review.replies
  });
});
