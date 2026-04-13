import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: { type: String, default: "" },

    discountType: {
      type: String,
      enum: ["flat", "percent"],
      required: true,
    },

    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number }, // cap for percent coupons (e.g. max ₹200 off)

    minOrderAmount: { type: Number, default: 0 }, // minimum cart value to apply

    // Usage limits
    usageLimitTotal: { type: Number }, // null = unlimited
    usageLimitPerUser: { type: Number, default: 1 },

    // Tracks who used it
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        usedAt: { type: Date, default: Date.now },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      },
    ],

    totalUsed: { type: Number, default: 0 },

    // Applicability
    applicableCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],
    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],

    isActive: { type: Boolean, default: true, index: true },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, index: true },
  },
  { timestamps: true, versionKey: false },
);

// Indexes
CouponSchema.index({ isActive: 1, expiresAt: 1 });

const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
