import mongoose from "mongoose";

const WishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    variantSkuId: {
      type: String,
      required: true,
      index: true,
    },

    // SNAPSHOT DATA
    productTitle: {
      type: String,
      required: true,
    },

    variantName: {
      type: String,
      default: "",
    },

    variantColor: {
      type: String,
      default: "",
    },

    variantAvailableStock: {
      type: Number,
      default: 0,
      index: true,
    },

    // ✅ FLEXIBLE ATTRIBUTES
    variantAttributes: {
      type: Map,
      of: String,
      default: {},
    },

    // IMAGE SNAPSHOT
    image: {
      url: { type: String, default: "" },
      altText: { type: String, default: "" },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
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

const Wishlist = mongoose.model("Wishlist", WishlistSchema);

export default Wishlist;
