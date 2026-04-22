import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    // Full snapshot
    variantSkuId: { type: String, required: true },
    variantName: { type: String, default: "" },
    variantColor: { type: String, default: "" },
    productTitle: { type: String, required: true },
    image: {
      url: { type: String, default: "" },
      altText: { type: String, default: "" },
    },

    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    quantity: { type: Number, required: true, min: 1 },
    itemTotal: { type: Number, required: true }, // sellingPrice * qty

    // Individual item status (for partial returns / cancellations)
    status: {
      type: String,
      enum: ["active", "cancelled", "refunded"],
      default: "active",
    },
  },
  { _id: true, timestamps: false },
);

const ShippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Human-readable order number (e.g. ORD-20240412-0001)
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    // Items
    items: [OrderItemSchema],

    // Address snapshot
    shippingAddress: { type: ShippingAddressSchema, required: true },

    // Financial (all in INR paise-safe floats)
    subtotal: { type: Number, required: true },
    totalGST: { type: Number, default: 0 },
    shippingCharge: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    // Payment
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    // Order lifecycle status
    status: {
      type: String,
      enum: [
        "pending",
        "placed",
        // "confirmed",
        "processing",
        "ready_to_ship",
        "shipped",
        "delivered",
        // "cancelled",
        // "refunded",
      ],
      default: "placed",
      index: true,
    },

    // Shipping / logistics
    tracking: {
      carrier: String, // "Delhivery", "BlueDart", etc.
      trackingNumber: String,
      trackingUrl: String,
    },

    reward: {
      earnedPoints: Number,
      usedPoints: Number,
    },

    // Timestamps
    placedAt: { type: Date, default: Date.now },
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true, versionKey: false },
);

// Compound indexes
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1, status: 1 });

// Auto-generate orderNumber before first save
OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${dateStr}-${String(count + 1).padStart(4, "0")}`;
  }

  next();
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
