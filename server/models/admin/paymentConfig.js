import mongoose from "mongoose";

const paymentConfigSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["razorpay", "stripe", "cashfree"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    credentials: {
      keyId: String,
      keySecret: String,
    },

    webhookSecret: String,

    extraConfig: {
      type: Object,
    },
  },
  { timestamps: true, versionKey: false },
);

// only one active gateway
paymentConfigSchema.index(
  { isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);
const PaymentConfig = mongoose.model("PaymentConfig", paymentConfigSchema);
export default PaymentConfig;
