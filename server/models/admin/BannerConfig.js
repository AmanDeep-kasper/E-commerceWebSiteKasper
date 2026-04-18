import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: Number,
      default: 0,
      index: true, // sorting fast
    },

    bannerType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    title: {
      type: String,
      trim: true,
    },

    imageOrVideo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

// INDEX
bannerSchema.index({ isActive: 1, serialNumber: 1 });

// auto increase serial number
bannerSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastBanner = await Banner.findOne().sort({ serialNumber: -1 });
    this.serialNumber = lastBanner ? lastBanner.serialNumber + 1 : 1;
  }
  next();
});

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
