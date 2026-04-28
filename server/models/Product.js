import mongoose from "mongoose";
import slugify from "slugify";

const VariantSchema = new mongoose.Schema({
  variantColor: { type: String, default: "", index: true },
  variantName: { type: String, default: "", index: true },

  variantWeight: { type: Number, default: 0 },
  variantWeightUnit: {
    type: String,
    enum: ["kg", "g", "mg"],
    default: "kg",
  },

  variantSkuId: {
    type: String,
    required: true,
  },

  variantImage: [
    {
      url: { type: String, default: "", required: true },
      publicId: { type: String, default: "", required: true },
      altText: { type: String, default: "" },
    },
  ],

  variantMrp: { type: Number, default: 0, required: true, index: true },
  variantCostPrice: { type: Number, default: 0 },
  variantSellingPrice: { type: Number, default: 0, required: true },

  variantGST: { type: Number, default: 0, required: true },

  variantDiscount: { type: Number, default: 0 },

  variantAvailableStock: { type: Number, default: 0, index: true },
  variantLowStockAlertStock: { type: Number, default: 0, required: true },

  isSelected: { type: Boolean, default: false, index: true },
});

const ProductSchema = new mongoose.Schema(
  {
    productTittle: { type: String, required: true },
    description: { type: String, default: "" },

    slug: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    variants: {
      type: [VariantSchema],
      default: [],
      validate: {
        validator: function (v) {
          if (this.isDraft) return true;
          return v.length > 0;
        },
        message: "At least one variant is required",
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: function () {
        return !this.isDraft;
      },
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDraft: {
      type: Boolean,
      default: false,
      index: true,
    },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

    stats: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        index: true,
      },
      totalReviews: {
        type: Number,
        default: 0,
        index: true,
      },
      totalSold: {
        type: Number,
        default: 0,
        index: true,
      },
    },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true, versionKey: false },
);

// ✅ COMPOUND INDEXES (VERY IMPORTANT)
ProductSchema.index({ category: 1 });
ProductSchema.index({ productTittle: 1 });
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ status: 1, "stats.averageRating": -1 });
ProductSchema.index({ "variants.variantSellingPrice": 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ isActive: 1, isDraft: 1 });
ProductSchema.index({
  isActive: 1,
  isDraft: 1,
  "variants.variantAvailableStock": 1,
});

ProductSchema.index(
  { "variants.variantSkuId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDraft: false, // ✅ only enforce for non-draft
      "variants.variantSkuId": { $exists: true, $ne: "" },
    },
  },
);

// ✅ AUTO SLUG GENERATION (CREATE + UPDATE)
ProductSchema.pre("save", function (next) {
  if (this.isModified("productTittle")) {
    this.slug = slugify(this.productTittle, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

// ✅ HANDLE findOneAndUpdate (IMPORTANT)
ProductSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.productTittle) {
    update.slug = slugify(update.productTittle, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  next();
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
