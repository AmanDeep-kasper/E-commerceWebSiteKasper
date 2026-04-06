import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    slug: {
      type: String,
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
    versionKey: false,
  },
);

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ parentId: 1, displayOrder: 1 });
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ path: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1, displayOrder: 1 });
categorySchema.index({ createdAt: -1 });
categorySchema.index({ updatedAt: -1 });

// Pre-save middleware to generate slug and path
categorySchema.pre("validate", async function (next) {
  // Generate slug if name exists
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  // Handle parent logic
  if (this.parentId) {
    const parent = await mongoose.model("Category").findById(this.parentId);

    if (!parent) {
      return next(new Error("Parent category not found"));
    }

    this.path = `${parent.path}/${this.slug}`;
    this.level = parent.level + 1;
  } else {
    this.path = this.slug;
    this.level = 0;
  }

  next();
});

// Method to update all children paths
categorySchema.methods.updateChildrenPaths = async function () {
  const children = await mongoose
    .model("Category")
    .find({ parentId: this._id });

  for (const child of children) {
    child.path = `${this.path}/${child.slug}`;
    child.level = this.level + 1;

    await child.save(); // triggers pre("validate")

    await child.updateChildrenPaths(); // recursion
  }
};

const Category = mongoose.model("Category", categorySchema);

export default Category;
