import PaymentConfig from "../../models/admin/paymentConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import env from "../../config/env.js";
import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = process.env.CONFIG_SECRET_KEY;

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text) => {
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

export const addPaymentGateway = asyncHandler(async (req, res) => {
  const {
    provider,
    keyId,
    keySecret,
    webhookSecret,
    isActive = false,
    extraConfig = {},
  } = req.body;

  // VALIDATION
  if (!provider) {
    throw AppError.badRequest("Provider is required", "PROVIDER_REQUIRED");
  }

  if (!["razorpay", "stripe", "cashfree"].includes(provider)) {
    throw AppError.badRequest("Invalid provider", "INVALID_PROVIDER");
  }

  if (!keyId || !keySecret) {
    throw AppError.badRequest(
      "KeyId and KeySecret are required",
      "CREDENTIALS_REQUIRED",
    );
  }

  // ENCRYPT SENSITIVE DATA 
  const encryptedCredentials = {
    keyId: encrypt(keyId),
    keySecret: encrypt(keySecret),
  };

  const encryptedWebhookSecret = webhookSecret ? encrypt(webhookSecret) : null;


  // HANDLE ACTIVE SWITCH
  if (isActive) {
    await PaymentConfig.updateMany(
      { isActive: true },
      { $set: { isActive: false } },
    );
  }

  // CREATE CONFIG
  const config = await PaymentConfig.create({
    provider,
    isActive,
    credentials: encryptedCredentials,
    webhookSecret: encryptedWebhookSecret,
    extraConfig,
  });

  res.status(201).json({
    success: true,
    message: "Payment gateway added successfully",
    data: {
      _id: config._id,
      provider: config.provider,
      isActive: config.isActive,
      createdAt: config.createdAt,
    },
  });
});
