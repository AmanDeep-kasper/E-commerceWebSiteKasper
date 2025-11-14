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

const variantSchema = new mongoose.Schema({
  variantId: {
    type: String,
    required: true,
  },

  //  Numeric fields
  height: { type: Number, default: 0, min: 0 },
  width: { type: Number, default: 0, min: 0 }, //  add width explicitly
  weight: { type: String, trim: true }, //  string for values like "12.9kg"

  //  Variant meta info
  variantType: { type: String, trim: true }, // e.g. "Framed", "Unframed"
  variantName: { type: String, trim: true }, // e.g. "Dimension"
  variantValue: { type: String, trim: true }, // e.g. "34*45cm"

  //  Stock control
  variantQuantity: { type: Number, default: 0, min: 0 },
  variantReorderLimit: { type: Number, default: 0, min: 0 },

  //  Images
  variantImage: { type: [String], default: [] }, // Array of image URLs
});

const productSchema = new mongoose.Schema({
  //  Basic info
  uuid: { type: String, required: true, unique: true },
  type: { type: String, enum: ["Framed", "Unframed"], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },

  // Main product images
  images: { type: [String], default: [] },

  //  Product details
  SKU: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true },
  tags: { type: [String], default: [] },
  materialType: { type: String, trim: true },
  weight: { type: String, trim: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
  returnPolicy: { type: Boolean, default: false },

  //  Pricing
  mrp: { type: Number, required: true, min: 0 },
  sellingPrice: { type: Number, required: true, min: 0 },
  costPrice: { type: Number, default: 0, min: 0 },
  profit: { type: Number, default: 0, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  discountAmount: { type: Number, default: 0, min: 0 },
  includesTax: { type: Boolean, default: false },
  taxPercent: { type: String, default: "0%" },

  //  Variants
  hasVariants: { type: Boolean, default: false },
  variants: [variantSchema],

  //  System fields
  createdAt: { type: Date, default: Date.now },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
