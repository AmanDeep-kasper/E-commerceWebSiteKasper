import Razorpay from "razorpay";
import crypto from "crypto";
import env from "../config/env.js";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_API_KEY,
  key_secret: env.RAZORPAY_API_SECRET,
});

export const createRazorpayOrder = async (amountInRupees, notes = {}) => {
  const options = {
    amount: Math.round(amountInRupees * 100), // paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes,
    payment_capture: 1, // auto-capture
  };

  const order = await razorpay.orders.create(options);
  return order;
};

export const verifyPaymentSignature = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpaySignature;
};

export const verifyWebhookSignature = (rawBody, signature) => {
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
};

export const fetchPaymentDetails = async (razorpayPaymentId) => {
  return razorpay.payments.fetch(razorpayPaymentId);
};

export const initiateRefund = async (
  razorpayPaymentId,
  amountInRupees,
  notes = {},
) => {
  const refund = await razorpay.payments.refund(razorpayPaymentId, {
    amount: Math.round(amountInRupees * 100), // paise
    speed: "normal", // "normal" (5-7 days) or "optimum"
    notes,
  });
  return refund;
};

export default razorpay;
