import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    description: String,
    categoryImage: {
      url: String,
      publicId: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 0, // 0 = root, 1 = sub, 2 = sub-sub
    },

    path: {
      type: String, // e.g., "home-decor/wall-art/metal-wall-art"
      index: true,
    },
    
    metaTitle: String,
    metaDescription: String,
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to generate slug and path
categorySchema.pre("save", async function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  if (this.parentId) {
    const parent = await mongoose.model("Category").findById(this.parentId);
    if (parent) {
      this.path = `${parent.path}/${this.slug}`;
      this.level = parent.level + 1;
    }
  } else {
    this.path = this.slug;
    this.level = 0;
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
