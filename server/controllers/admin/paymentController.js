import PaymentConfig from "../../models/admin/paymentConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { encrypt } from "../../utils/paymentConfig.js";
import { loadPaymentGateway } from "../../service/paymentManager.js";

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

  // after saving config
  await loadPaymentGateway(true);

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

export const getAllPaymentGateways = asyncHandler(async (req, res) => {
  const configs = await PaymentConfig.find({}).sort({ createdAt: -1 }).lean();

  const masked = configs.map((item) => ({
    _id: item._id,
    provider: item.provider,
    isActive: item.isActive,
    keyId: item.credentials?.keyId
      ? "****" + item.credentials.keyId.slice(-4)
      : null,
    hasWebhook: !!item.webhookSecret,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  res.status(200).json({
    success: true,
    data: masked,
  });
});

export const getActivePaymentGateway = asyncHandler(async (req, res) => {
  const config = await PaymentConfig.findOne({ isActive: true }).lean();

  if (!config) {
    throw AppError.notFound("No active payment gateway", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    data: {
      _id: config._id,
      provider: config.provider,
    },
  });
});

export const updatePaymentGateway = asyncHandler(async (req, res) => {
  const { PaymentConfigId } = req.params;

  const { provider, keyId, keySecret, webhookSecret, isActive, extraConfig } =
    req.body;

  const existing = await PaymentConfig.findById(PaymentConfigId);

  if (!existing) {
    throw AppError.notFound("Payment config not found", "NOT_FOUND");
  }

  // handle active switch
  if (isActive === true) {
    await PaymentConfig.updateMany(
      { _id: { $ne: PaymentConfigId }, isActive: true },
      { $set: { isActive: false } },
    );
  }

  // update fields safely
  if (provider) existing.provider = provider;

  if (keyId) {
    existing.credentials.keyId = encrypt(keyId);
  }

  if (keySecret) {
    existing.credentials.keySecret = encrypt(keySecret);
  }

  if (webhookSecret) {
    existing.webhookSecret = encrypt(webhookSecret);
  }

  if (extraConfig) {
    existing.extraConfig = extraConfig;
  }

  if (isActive !== undefined) {
    existing.isActive = isActive;
  }

  await existing.save();

  res.status(200).json({
    success: true,
    message: "Payment gateway updated successfully",
  });
});

export const setActivePaymentGateway = asyncHandler(async (req, res) => {
  const { PaymentConfigId } = req.params;

  const config = await PaymentConfig.findById(PaymentConfigId);

  if (!config) {
    throw AppError.notFound("Payment config not found", "NOT_FOUND");
  }

  // deactivate all
  await PaymentConfig.updateMany(
    { isActive: true },
    { $set: { isActive: false } },
  );

  // activate selected
  config.isActive = true;
  await config.save();

  res.status(200).json({
    success: true,
    message: "Payment gateway activated",
  });
});

export const deletePaymentGateway = asyncHandler(async (req, res) => {
  const { PaymentConfigId } = req.params;

  const config = await PaymentConfig.findById(PaymentConfigId);

  if (!config) {
    throw AppError.notFound("Payment config not found", "NOT_FOUND");
  }

  if (config.isActive) {
    throw AppError.badRequest(
      "Cannot delete active payment gateway",
      "ACTIVE_DELETE_NOT_ALLOWED",
    );
  }

  await config.deleteOne();

  res.status(200).json({
    success: true,
    message: "Payment gateway deleted successfully",
  });
});
