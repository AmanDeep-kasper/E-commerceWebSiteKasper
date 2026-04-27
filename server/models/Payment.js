import mongoose from "mongoose";

const RefundSchema = new mongoose.Schema(
  {
    razorpayRefundId: { type: String, index: true },
    amount: { type: Number, required: true },
    reason: {
      type: String,
      enum: [
        "customer_request",
        "order_cancelled",
        "item_returned",
        "fraud",
        "other",
      ],
      default: "customer_request",
    },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },
    processedAt: Date,
  },
  { timestamps: true, _id: true },
);

const PaymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderId: {
      type: String,
      required: true,
      index: true,
    },

    // Amount
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    method: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "emi", "cod", ""],
      default: "",
    },
    bank: String,
    wallet: String,
    vpa: String,

    card: {
      last4: String,
      network: String,
      issuer: String,
      international: Boolean,
      emiBankCode: String,
    },

    // Status
    status: {
      type: String,
      enum: [
        "created",
        "authorized",
        "captured",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "created",
      index: true,
    },

    errorCode: String,
    errorDescription: String,
    errorSource: String,
    errorReason: String,

    // Refunds
    refunds: [RefundSchema],
    totalRefunded: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
    capturedAt: Date,
    failedAt: Date,

    razorpayRawResponse: { type: mongoose.Schema.Types.Mixed },

    notes: {
      orderNumber: String,
      customerName: String,
      customerEmail: String,
    },
  },
  { timestamps: true, versionKey: false },
);

// Compound indexes
PaymentSchema.index({ order: 1, status: 1 });
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ method: 1 });
PaymentSchema.index({ razorpayPaymentId: 1 });
PaymentSchema.index({ razorpayOrderId: 1 });

// Instance method: add a refund
PaymentSchema.methods.addRefund = async function ({
  razorpayRefundId,
  amount,
  reason = "customer_request",
  notes = "",
}) {
  this.refunds.push({
    razorpayRefundId,
    amount,
    reason,
    notes,
    status: "processed",
    processedAt: new Date(),
  });

  this.totalRefunded += amount;

  // Update payment status
  if (this.totalRefunded >= this.amount) {
    this.status = "refunded";
  } else {
    this.status = "partially_refunded";
  }

  return this.save();
};

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
