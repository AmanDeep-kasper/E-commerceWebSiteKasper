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
    size: String,
    color: String,
    material: String,
    weightKg: Number,
    dimensions: String,
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
      default: 0,
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

// Pre-save middleware for variant discount calculation
productVariantSchema.pre("save", function (next) {
  if (this.mrpPrice && this.sellingPrice) {
    this.discountPercent = Number(
      (((this.mrpPrice - this.sellingPrice) / this.mrpPrice) * 100).toFixed(2),
    );
  }
  next();
});

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
    brand: {
      type: String,
      index: true,
    },

    // Relationships
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        index: true,
      },
    ],

    // Variants (embedded for performance)
    variants: [productVariantSchema],

    // Flexible attributes (EAV pattern)
    attributes: [
      {
        name: String,
        value: String,
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
      index: true,
    },
    isLatest: {
      type: Boolean,
      default: false,
      index: true,
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

    // Price range for better filtering
    priceRange: {
      min: Number,
      max: Number,
    },
    avgSellingPrice: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ==================== INDEXES ====================

// Text search indexes
productSchema.index({ name: "text", shortDescription: "text", brand: "text" });

// Compound indexes for filtering
productSchema.index({ isActive: 1, isFeatured: 1, createdAt: -1 });
productSchema.index({ isActive: 1, "variants.sellingPrice": 1 });
productSchema.index({ isActive: 1, "stats.averageRating": -1 });
productSchema.index({ isActive: 1, "stats.totalSold": -1 });
productSchema.index({ categories: 1, isActive: 1 });
productSchema.index({ brand: 1, isActive: 1 });

// Price range index
productSchema.index({ "priceRange.min": 1, "priceRange.max": 1 });

// ==================== MIDDLEWARE ====================

// Pre-save middleware to generate slug
productSchema.pre("save", async function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Check for duplicate slug
    const existingProduct = await mongoose.model("Product").findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    });

    if (existingProduct) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }

  // Update price range before saving
  if (this.variants && this.variants.length > 0) {
    const prices = this.variants.map((v) => v.sellingPrice);
    this.priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
    this.avgSellingPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  }

  next();
});

// Post-save middleware to ensure only one default variant
productSchema.post("save", async function (doc) {
  const defaultVariants = doc.variants.filter((v) => v.isDefault);

  if (defaultVariants.length > 1) {
    // Keep only the first default variant
    let firstDefault = true;
    for (const variant of doc.variants) {
      if (variant.isDefault) {
        if (firstDefault) {
          firstDefault = false;
        } else {
          variant.isDefault = false;
        }
      }
    }
    await doc.save();
  } else if (defaultVariants.length === 0 && doc.variants.length > 0) {
    // Set first variant as default
    doc.variants[0].isDefault = true;
    await doc.save();
  }
});

// ==================== INSTANCE METHODS ====================

// Get default variant
productSchema.methods.getDefaultVariant = function () {
  return this.variants.find((v) => v.isDefault) || this.variants[0];
};

// Get in-stock variants
productSchema.methods.getInStockVariants = function () {
  return this.variants.filter((v) => v.stockQuantity > 0);
};

// Check if product is in stock
productSchema.methods.isInStock = function () {
  return this.variants.some((v) => v.stockQuantity > 0);
};

// Update average rating
productSchema.methods.updateRating = async function () {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    this.stats.averageRating = totalRating / this.reviews.length;
    this.stats.totalReviews = this.reviews.length;
    await this.save();
  }
  return this.stats;
};

// Get lowest price
productSchema.methods.getLowestPrice = function () {
  return Math.min(...this.variants.map((v) => v.sellingPrice));
};

// Get highest price
productSchema.methods.getHighestPrice = function () {
  return Math.max(...this.variants.map((v) => v.sellingPrice));
};

// ==================== STATIC METHODS ====================

// Get featured products
productSchema.statics.getFeatured = async function (limit = 10) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("categories", "name slug");
};

// Get products by category
productSchema.statics.getByCategory = async function (categoryId, limit = 20) {
  return this.find({ categories: categoryId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Search products
productSchema.statics.searchProducts = async function (
  searchTerm,
  filters = {},
) {
  const query = {
    $text: { $search: searchTerm },
    isActive: true,
    ...filters,
  };

  return this.find(query)
    .sort({ score: { $meta: "textScore" } })
    .populate("categories", "name slug");
};

// ==================== VIRTUAL FIELDS ====================

productSchema.virtual("hasVariants").get(function () {
  return this.variants.length > 1;
});

productSchema.virtual("totalStock").get(function () {
  return this.variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);
});

productSchema.virtual("isLowStock").get(function () {
  return this.totalStock > 0 && this.totalStock <= 10;
});

productSchema.virtual("availableFilters").get(function () {
  return {
    sizes: [...new Set(this.variants.map((v) => v.size).filter(Boolean))],
    colors: [...new Set(this.variants.map((v) => v.color).filter(Boolean))],
    materials: [
      ...new Set(this.variants.map((v) => v.material).filter(Boolean)),
    ],
  };
});

// Ensure virtuals are included in JSON output
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
