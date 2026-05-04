import Razorpay from "razorpay";
import PaymentConfig from "../models/admin/paymentConfig.js";
import { decrypt } from "../utils/paymentConfig.js";

let cachedGateway = null;
let lastLoadedAt = 0;

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const loadPaymentGateway = async (force = false) => {
  const now = Date.now();

  if (!force && cachedGateway && now - lastLoadedAt < CACHE_TTL) {
    return cachedGateway;
  }

  const config = await PaymentConfig.findOne({ isActive: true }).lean();

  if (!config) {
    throw new Error("No active payment gateway configured");
  }

  const keyId = decrypt(config.credentials.keyId);
  const keySecret = decrypt(config.credentials.keySecret);

  let instance = null;

  switch (config.provider) {
    case "razorpay":
      instance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      break;

    default:
      throw new Error("Unsupported payment provider");
  }

  cachedGateway = {
    provider: config.provider,
    instance,
    keySecret, // for signature verification
    webhookSecret: config.webhookSecret ? decrypt(config.webhookSecret) : null,
  };

  lastLoadedAt = now;

  return cachedGateway;
};
