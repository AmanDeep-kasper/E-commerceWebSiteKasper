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

// Instance method: validate coupon for a cart
CouponSchema.methods.validate = function (userId, cartTotal) {
  const now = new Date();

  if (!this.isActive) return { valid: false, message: "Coupon is inactive" };
  if (this.expiresAt && this.expiresAt < now)
    return { valid: false, message: "Coupon has expired" };
  if (this.startsAt > now)
    return { valid: false, message: "Coupon is not yet active" };
  if (cartTotal < this.minOrderAmount) {
    return {
      valid: false,
      message: `Minimum order value ₹${this.minOrderAmount} required`,
    };
  }
  if (this.usageLimitTotal && this.totalUsed >= this.usageLimitTotal) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  const userUsage = this.usedBy.filter(
    (u) => u.user.toString() === userId.toString(),
  ).length;
  if (userUsage >= this.usageLimitPerUser) {
    return { valid: false, message: "You have already used this coupon" };
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (this.discountType === "flat") {
    discountAmount = this.discountValue;
  } else {
    discountAmount = (cartTotal * this.discountValue) / 100;
    if (this.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, this.maxDiscountAmount);
    }
  }
  discountAmount = Math.min(discountAmount, cartTotal); // can't discount more than cart

  return { valid: true, discountAmount: parseFloat(discountAmount.toFixed(2)) };
};

const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
