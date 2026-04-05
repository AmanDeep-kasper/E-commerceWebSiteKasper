import mongoose from "mongoose";

const reviewImageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  caption: String,
});

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product.variants",
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
    reviewerEmail: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    images: [reviewImageSchema],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulVotes: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
        },
        ipAddress: String,
        votedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reply: {
      text: String,
      repliedBy: String,
      repliedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for unique customer-product review
reviewSchema.index(
  { productId: 1, customerId: 1 },
  { unique: true, sparse: true },
);

// Static method to update product average rating
reviewSchema.statics.updateProductRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: {
        productId: mongoose.Types.ObjectId(productId),
        isApproved: true,
      },
    },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      "stats.averageRating": Number(result[0].averageRating.toFixed(1)),
      "stats.totalReviews": result[0].totalReviews,
    });
  }
};

// Post-save middleware to update product stats
reviewSchema.post("save", function () {
  this.constructor.updateProductRating(this.productId);
});

reviewSchema.post("findOneAndUpdate", function (doc) {
  if (doc) {
    doc.constructor.updateProductRating(doc.productId);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
