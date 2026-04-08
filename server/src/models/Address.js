import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[6-9]\d{9}$/, "Please provide a valid phone number"],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },

    pinCode: {
      type: String,
      required: [true, "PIN code is required"],
      match: [/^[0-9]{6}$/, "Please enter a valid 6-digit PIN code"],
    },

    addressType: {
      type: String,
      enum: ["home", "work", "other"],
      default: "other",
      index: true,
    },

    country: {
      type: String,
      default: "INDIA",
      uppercase: true,
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Compound Indexes
addressSchema.index({ userId: 1, isDefault: 1 });
addressSchema.index({ userId: 1, isActive: 1 });
addressSchema.index({ userId: 1, addressType: 1 });
addressSchema.index({ pinCode: 1, city: 1 });
addressSchema.index({ userId: 1, createdAt: -1 });

const Address = mongoose.model("Address", addressSchema);

export default Address;
