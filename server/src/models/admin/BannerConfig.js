import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    serialNumber: Number,
    bannerType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    title: String,
    imageOrVideo: {
      url: String,
      publicId: String,
    },
    description: String,
    isActive: Boolean,
  },
  { timestamps: true, versionKey: false },
);

const Banner = mongoose.model("Banner", BannerSchema);

export default Banner;
