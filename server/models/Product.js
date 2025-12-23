// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//   uuid: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   route: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   title: { type: String, required: true, trim: true },
//   category: { type: String, required: true, trim: true },
//   subcategory: { type: String, trim: true },
//   tags: { type: [String], default: [] },
//   SKU: {
//     type: String,
//     required: true,
//     unique: true,
//     uppercase: true,
//     trim: true,
//   },
//   dimension: { type: String, trim: true },
//   basePrice: { type: Number, required: true, min: 0 },
//   amazonPrice: { type: Number, min: 0 },
//   discountPercent: { type: Number, default: 0, min: 0, max: 100 },
//   materialType: { type: [String], default: [] },
//   color: { type: [String], default: [] },
//   stockQuantity: { type: Number, default: 0, min: 0 },
//   deliverBy: { type: Number, default: 3 },
//   returnPolicy: { type: String, trim: true },
//   weight: { type: String, trim: true },
//   type: { type: String, enum: ["Framed", "Unframed"], required: true },
//   description: { type: String, trim: true },
//   image: {
//     type: [String],
//     validate: [(arr) => arr.length <= 4, "Maximum 4 images allowed"],
//     default: [],
//   },
//   bulletPoints: { type: [String], default: [] },
//   reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
//   createdAt: { type: Date, default: Date.now },
// });

// //  Fix: prevent OverwriteModelError
// const Product =
//   mongoose.models.Product || mongoose.model("Product", productSchema);

// export default Product;

// old yunes

import mongoose from "mongoose";

/* ===============================
   Variant Schema
================================ */
const variantSchema = new mongoose.Schema(
  {
    // Unique IDs
    variantId: {
      type: String,
      required: true,
    },

    variantSkuId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    // Variant attributes
    variantColor: {
      type: String,
      trim: true,
    },

    variantFrameType: {
      type: String,
      trim: true, // Framed / Unframed
    },

    // Dimensions
    variantWidth: {
      type: Number,
      default: 0,
      min: 0,
    },

    variantHeight: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Stock
    variantStockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    variantReorderLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Pricing
    variantMrp: {
      type: Number,
      default: 0,
      min: 0,
    },

    variantSellingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    variantCostPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    variantProfit: {
      type: Number,
      default: 0,
    },

    variantDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Images (store URLs, not files)
    variantImage: {
      type: [String],
      default: [],
    },
  },
  { _id: false } // variants embedded, no extra _id
);

/* ===============================
   Product Schema
================================ */
const productSchema = new mongoose.Schema(
  {
    // Core identifiers
    uuid: {
      type: String,
      required: true,
      unique: true,
    },

    route: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    SKU: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // Basic info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    returnPolicy: {
      type: Boolean,
      default: false,
    },

    // Images (product level)
    images: {
      type: [String],
      default: [],
    },

    // Product details
    type: {
      type: String,
      trim: true, // Framed / Unframed
    },

    color: {
      type: String,
      trim: true,
    },

    ProductDimensionWidth: {
      type: Number,
      default: 0,
      min: 0,
    },

    ProductDimensionHeight: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    subcategory: {
      type: String,
      trim: true,
    },

    materialType: {
      type: String,
      trim: true,
    },

    // Inventory
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    ReorderLimit: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Pricing (product-level)
    mrp: {
      type: Number,
      default: 0,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    costPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    profit: {
      type: Number,
      default: 0,
    },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    taxPercent: {
      type: String,
      default: "0%",
    },

    // Variants
    hasVariants: {
      type: Boolean,
      default: false,
    },

    variants: {
      type: [variantSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* ===============================
   Model Export
================================ */
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
