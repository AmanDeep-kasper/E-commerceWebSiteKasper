import mongoose from "mongoose";

// 🟢 CART ITEM
const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    variantSkuId: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // SNAPSHOT (CRITICAL)
    productTitle: { type: String, required: true },
    variantName: { type: String, default: "" },
    variantColor: { type: String, default: "" },
    variantAvailableStock: { type: Number, default: 0 },

    variantAttributes: {
      type: Map,
      of: String,
      default: {},
    },

    image: {
      url: { type: String, default: "" },
      altText: { type: String, default: "" },
    },

    // PRICING SNAPSHOT
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    itemTotal: { type: Number, default: 0 },
  },
  { _id: true },
);

// CART SCHEMA
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
    },

    // // REWARD (NO COUPON AS PER YOUR REQUIREMENT)
    // reward: {
    //   usedPoints: { type: Number, default: 0 },
    //   discount: { type: Number, default: 0 },
    // },

    // TOTALS
    subtotal: { type: Number, default: 0 },
    totalGST: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["active", "checked_out", "abandoned"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

// INDEXES (IMPORTANT)
CartSchema.index({ userId: 1, status: 1 });
CartSchema.index({ userId: 1, "items.product": 1, "items.variantId": 1 });

// RECALCULATE ENGINE (HEART)
CartSchema.methods.recalculate = function () {
  let subtotal = 0;
  let totalGST = 0;
  let totalQty = 0;

  for (const item of this.items) {
    const base = item.sellingPrice * item.quantity;
    const gstAmt = (base * item.gst) / 100;

    item.itemTotal = base;

    subtotal += base;
    totalGST += gstAmt;
    totalQty += item.quantity;
  }

  this.totalQuantity = totalQty;

  // ✅ SAFE DEFAULTS (VERY IMPORTANT)
  // const shippingCharge = this.shipping?.charge || 0;
  // const rewardDiscount = this.reward?.discount || 0;

  this.subtotal = Math.round(subtotal * 100) / 100;
  this.totalGST = Math.round(totalGST * 100) / 100;

  this.grandTotal = Math.round((subtotal + totalGST) * 100) / 100;
};

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
