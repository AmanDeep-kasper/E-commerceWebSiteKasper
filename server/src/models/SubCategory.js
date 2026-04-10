import mongoose from "mongoose";
import slugify from "slugify";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    description: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true, versionKey: false }
);

// INDEXES
subCategorySchema.index({ category: 1, name: 1 }, { unique: true });
subCategorySchema.index({ isActive: 1 });

// SLUG
subCategorySchema.pre("validate", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("SubCategory", subCategorySchema);