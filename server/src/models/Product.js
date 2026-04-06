import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    size: String, // "40X25 Inches"
    color: String, // "Gold"
    material: String, // "Metal"
    weightKg: Number,
    dimensions: String, // "40x25x0.2 inches"
    mrpPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: function () {
        if (this.mrpPrice && this.sellingPrice) {
          return Number(
            (
              ((this.mrpPrice - this.sellingPrice) / this.mrpPrice) *
              100
            ).toFixed(2),
          );
        }
        return 0;
      },
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
        publicId: String,
        altText: String,
        isPrimary: Boolean,
        displayOrder: Number,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: String,
    fullDescription: String,
    brand: String,

    // Relationships
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // Variants (embedded for performance)
    variants: [productVariantSchema],

    // Flexible attributes (EAV pattern)
    attributes: [
      {
        name: String, // "Sub-Category", "Finish Type"
        value: String, // "Abstract Decor", "Gold-toned frame"
        displayOrder: Number,
      },
    ],

    // Media (product-level images)
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        altText: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
        displayOrder: {
          type: Number,
          default: 0,
        },
      },
    ],

    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],

    // Status flags
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Aggregated stats
    stats: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      totalSold: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes for performance
productSchema.index({ name: "text", shortDescription: "text" });
productSchema.index({ "variants.sellingPrice": 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ "stats.averageRating": -1 });

// Pre-save middleware to generate slug
productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  next();
});

// Method to get default variant
productSchema.methods.getDefaultVariant = function () {
  return this.variants.find((v) => v.isDefault) || this.variants[0];
};

const Product = mongoose.model("Product", productSchema);

export default Product;
