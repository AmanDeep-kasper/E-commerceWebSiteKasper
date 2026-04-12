import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Snapshot at add-to-cart time
    variantSkuId: { type: String, required: true },
    variantName: { type: String, default: "" },
    variantColor: { type: String, default: "" },
    productTitle: { type: String, required: true },
    imageUrl: { type: String, default: "" },

    // Pricing snapshot
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    quantity: { type: Number, required: true, min: 1, default: 1 },

    // Computed: sellingPrice * quantity (updated on qty change)
    itemTotal: { type: Number, default: 0 },
  },
  { _id: true, timestamps: false },
);

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [CartItemSchema],

    totalQuantity: {
      type: Number,
      default: 0,
      index: true,
    },

    // Coupon
    coupon: {
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
      code: String,
      discountAmount: Number,
      discountType: { type: String, enum: ["flat", "percent"] },
      discountValue: { type: Number, default: 0 },
      maxDiscountAmount: Number,
      minimumCartValue: Number,
      lockedAt: Date,
      lockedUntil: Date,
      expiresAt: Date,
    },

    // Computed totals (recalculated on every item change)
    subtotal: { type: Number, default: 0 }, // sum of itemTotals (excl. GST)
    totalGST: { type: Number, default: 0 }, // sum of GST amounts
    couponDiscount: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 }, // final payable amount

    status: {
      type: String,
      enum: ["active", "checked_out", "abandoned"],
      default: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

// Indexes
CartSchema.index({ user: 1, isActive: 1 });

// Instance method: recalculate all totals
CartSchema.methods.recalculate = function () {
  let subtotal = 0;
  let totalGST = 0;

  for (const item of this.items) {
    const basePrice = item.sellingPrice * item.quantity;
    const gstAmount = (basePrice * item.gst) / 100;
    item.itemTotal = basePrice;
    subtotal += basePrice;
    totalGST += gstAmount;
  }

  this.subtotal = parseFloat(subtotal.toFixed(2));
  this.totalGST = parseFloat(totalGST.toFixed(2));
  this.grandTotal = parseFloat(
    (subtotal + totalGST + this.shippingCharge - this.couponDiscount).toFixed(
      2,
    ),
  );
};

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
