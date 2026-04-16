import Shipping from "../../models/admin/ShippingConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const upsertShippingConfig = asyncHandler(async (req, res) => {
  const payload = req.body;

  // ❗ basic validation
  if (!payload || Object.keys(payload).length === 0) {
    throw AppError.badRequest("No data provided", "EMPTY_PAYLOAD");
  }

  const config = await Shipping.findOneAndUpdate(
    {},
    {
      $set: {
        charges: payload.charges,
        metroCities: payload.metroCities,
        specialStates: payload.specialStates,
        freeDeliveryAbove: payload.freeDeliveryAbove,
        platformFee: payload.platformFee,
        additionalCharges: payload.additionalCharges,
        isActive: payload.isActive ?? true,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  ).lean();

  res.status(200).json({
    success: true,
    message: "Shipping config saved successfully",
    data: config,
  });
});

export const getShippingConfig = asyncHandler(async (req, res) => {
  const config = await Shipping.findOne(
    { isActive: true },
    {
      charges: 1,
      metroCities: 1,
      specialStates: 1,
      freeDeliveryAbove: 1,
      platformFee: 1,
      additionalCharges: 1,
    },
  ).lean();

  if (!config) {
    return res.status(200).json({
      success: true,
      data: null,
      message: "No shipping config found",
    });
  }

  res.status(200).json({
    success: true,
    data: config,
  });
});

export const getShippingConfigAdmin = asyncHandler(async (req, res) => {
  const config = await Shipping.findOne({}).lean();

  res.status(200).json({
    success: true,
    data: config || null,
  });
});
