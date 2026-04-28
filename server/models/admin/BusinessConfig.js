import mongoose from "mongoose";

const BusinessSettingSchema = new mongoose.Schema(
  {
    businessName: String,
    logo: {
      url: String,
      publicId: String,
    },
    gstNumber: String,
    companyNumber: String,

    address: {
      addressLine1: String,
      pinCode: Number,
      Landmark: String,
      city: String,
      state: String,
      country: {
        type: String,
        trim: true,
        default: "India",
      },
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      unique: true,
    },
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Please provide a valid phone number"],
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const BusinessSetting = mongoose.model(
  "BusinessSetting",
  BusinessSettingSchema,
);

export default BusinessSetting;
