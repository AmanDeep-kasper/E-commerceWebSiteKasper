import Review from "../models/Review.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";

export const addReview = asyncHandler(async (req, res) => {
  const { rating, reviewText } = req.body;
  const { productId } = req.params;
  const userId = req.user?.userId;
  const reviewImages = req.files;

  const product = await Product.findById(productId);

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  // uplaod images to cloudinary
  const uploadedImages = [];
  if (reviewImages) {
    for (const image of reviewImages) {
      const result = await uploadImageToCloudinary(image.path, "reviews");
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

  const reviews = await Review.find({ userId }).skip(skip).limit(limit).lean();
  const total = await Review.countDocuments({ userId });

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    data: reviews,
    pagination: {
      page,
      limit,
      total: reviews.length,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getAllProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const { sortBy } = req.query;
  const { productId } = req.params;

  const skip = (page - 1) * limit;

  let sort = { createdAt: -1 };

  if (sortBy === "mostOldest") {
    sort = { createdAt: 1 };
  } else if (sortBy === "highestRated") {
    sort = { rating: -1, createdAt: -1 };
  } else if (sortBy === "lowestRated") {
    sort = { rating: 1, createdAt: -1 };
  }

  const reviews = await Review.find({ productId })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
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
  const userId = req.user?.userId;

  const review = await Review.findById(reviewId);

  if (!review) {
    throw AppError.notFound("Review not found", "NOT_FOUND");
  }

  const product = await Product.findById(review.productId);

  // Ownership check
  if (review.userId.toString() !== userId.toString()) {
    throw AppError.unauthorized("Not allowed");
  }

  // Update fields
  if (rating !== undefined) review.rating = rating;
  if (reviewText !== undefined) review.reviewText = reviewText;

  // update product stats
  product.stats.averageRating = Number(
    (product.stats.averageRating * (product.stats.totalReviews - 1) +
      review.rating) /
      product.stats.totalReviews,
  ).toFixed(1);
  await product.save();

  // DELETE MULTIPLE IMAGES
  if (removeImages && Array.isArray(removeImages)) {
    // delete from cloudinary (parallel for speed)
    await Promise.all(
      removeImages.map((publicId) => deleteImageFromCloudinary(publicId)),
    );

    // remove from DB
    review.reviewImages = review.reviewImages.filter(
      (img) => !removeImages.includes(img.publicId),
    );
  }

  // ADD MULTIPLE IMAGES
  if (req.files && req.files.length > 0) {
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadImageToCloudinary(file.path, "reviews")),
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

  // check user eligibility
  if (review.userId.toString() !== req.user?.userId.toString()) {
    throw AppError.unauthorized("You are not authorized to delete this review");
  }

  if (!review) {
    throw AppError.notFound("Review not found", "NOT_FOUND");
  }

  const product = await Product.findById(review.productId);

  if (!product) {
    throw AppError.notFound("Product not found", "NOT_FOUND");
  }

  // recalculate totalReview count and avgRating of product
  product.stats.averageRating = Number(
    (product.stats.averageRating * product.stats.totalReviews - review.rating) /
      (product.stats.totalReviews - 1),
  ).toFixed(1);
  product.stats.totalReviews -= 1;

  await product.save();

  // delete images from cloudinary if exist
  if (review.reviewImages) {
    for (const image of review.reviewImages) {
      await deleteImageFromCloudinary(image.publicId);
    }
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
