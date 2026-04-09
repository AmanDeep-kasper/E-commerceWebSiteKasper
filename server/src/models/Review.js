import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    reviewerName: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },

    reviewText: {
      type: String,
      required: true,
    },

    reviewImages: [
      {
        url: String,
        publicId: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Compound index for unique customer-product review
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true, sparse: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
