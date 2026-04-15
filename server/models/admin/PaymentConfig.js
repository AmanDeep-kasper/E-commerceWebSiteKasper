import mongoose from "mongoose";

const PaymentConfigSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },

    razorpay: {
      keyId: String,
      secretKey: String,
      webhookUrl: String,
      isActive: Boolean,
    },

    bankDetails: {
      accountHolderName: String,
      bankName: String,
      accountNumber: String,
      ifscCode: String,
    },
  },
  { timestamps: true, versionKey: false },
);

const PaymentConfig = mongoose.model("PaymentConfig", PaymentConfigSchema);

export default PaymentConfig;
