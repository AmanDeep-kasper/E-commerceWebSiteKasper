import mongoose from "mongoose";

const WishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    variantName: { type: String, default: "" },
    productTitle: { type: String, required: true },
    imageUrl: { type: String, default: "" },
  },
  { _id: true },
);

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: [WishlistItemSchema],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

// Prevent duplicate product+variant combinations
WishlistSchema.index({ user: 1, "items.product": 1, "items.variantId": 1 });

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
export default Wishlist;
