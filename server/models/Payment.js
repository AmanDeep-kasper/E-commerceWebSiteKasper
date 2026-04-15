import mongoose from "mongoose";

const RefundSchema = new mongoose.Schema(
  {
    razorpayRefundId: { type: String, index: true },
    amount: { type: Number, required: true }, // in paise
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

    // Amount
    amount: { type: Number, required: true }, // paise  e.g. 49900 = ₹499
    currency: { type: String, default: "INR" },

    // Razorpay IDs
    // Step 1: backend creates an order → razorpayOrderId
    razorpayOrderId: { type: String, index: true },

    // Step 2: user pays → razorpayPaymentId + signature returned
    razorpayPaymentId: {
      type: String,
      sparse: true,
      index: true,
    },
    razorpaySignature: { type: String },

    // Payment method details (from Razorpay webhook)
    method: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "emi", "cod", ""],
      default: "",
    },
    bank: String, // for netbanking / EMI
    wallet: String, // "paytm", "phonepe", etc.
    vpa: String, // UPI VPA

    // Card details (partial — never store full card number)
    card: {
      last4: String,
      network: String, // "Visa", "Mastercard"
      issuer: String,
      international: Boolean,
      emiBankCode: String,
    },

    // Status
    status: {
      type: String,
      enum: [
        "created", // Razorpay order created, user hasn't paid yet
        "authorized", // authorized but not captured (rare)
        "captured", // payment captured successfully
        "failed", // payment failed
        "refunded", // full refund done
        "partially_refunded",
      ],
      default: "created",
      index: true,
    },

    // Razorpay error details on failure
    errorCode: String,
    errorDescription: String,
    errorSource: String, // "customer", "business", "bank", "gateway"
    errorReason: String,

    // Refunds
    refunds: [RefundSchema],
    totalRefunded: { type: Number, default: 0 }, // paise, sum of processed refunds

    // ── Webhook / verification flags ──────────────────────────
    isVerified: { type: Boolean, default: false }, // signature verified
    capturedAt: Date,
    failedAt: Date,

    // Raw Razorpay payment object (from webhook) — for debugging
    razorpayRawResponse: { type: mongoose.Schema.Types.Mixed },

    // Notes passed to Razorpay (visible in dashboard)
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

const RazorpayEventSchema = new mongoose.Schema(
  {
    // Razorpay's unique event ID — used for deduplication
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    event: {
      type: String,
      required: true,
      index: true,
      // e.g. "payment.captured", "payment.failed", "refund.processed"
    },

    payload: { type: mongoose.Schema.Types.Mixed, required: true },

    // Which Payment/Order this event relates to
    razorpayOrderId: { type: String, index: true },
    razorpayPaymentId: { type: String, index: true },

    status: {
      type: String,
      enum: ["received", "processed", "failed", "ignored"],
      default: "received",
    },

    processedAt: Date,
    errorMessage: String,
  },
  { timestamps: true, versionKey: false },
);

// TTL — auto-delete old webhook logs after 90 days
RazorpayEventSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 },
);

export const RazorpayEvent = mongoose.model(
  "RazorpayEvent",
  RazorpayEventSchema,
);
