import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    redirectUrl: { type: String, default: "" },
    order: { type: Number, default: null },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { _id: false },
);

const bannerSchema = new mongoose.Schema(
  {
    sectionType: {
      type: String,
      enum: ["hero", "carousel"],
      required: true,
      unique: true,
    },

    title: { type: String, default: "" },

    items: [mediaSchema],
  },
  { timestamps: true, versionKey: false },
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
