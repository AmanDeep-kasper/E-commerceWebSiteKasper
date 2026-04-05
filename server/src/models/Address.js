import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String },
    tag: { type: String, default: "Home" },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    phone: { type: String },
    zip: { type: String },
    isDefault: { type: Boolean, default: false }, // ✅ New field
  },
  { timestamps: true }
);

const Address = mongoose.model("address", addressSchema);

export default Address;
