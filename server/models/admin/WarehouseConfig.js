import mongoose from "mongoose";

const WarehouseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: String,
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Please provide a valid phone number"],
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      unique: true,
    },
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Warehouse = mongoose.model("Warehouse", WarehouseSchema);

export default Warehouse;
