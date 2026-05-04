import ServiceabilityConfig from "../../models/admin/serviceabilityConfig.js";
import Warehouse from "../../models/admin/WarehouseConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createServiceabilityConfig = asyncHandler(async (req, res) => {
  let { type, value, isServiceable } = req.body;

  const normalizedValue = value.trim();

  // validation
  if (type === "prefix" && !/^\d{2,4}$/.test(normalizedValue)) {
    throw AppError.badRequest("Invalid prefix (2–4 digits)", "INVALID_PREFIX");
  }

  if (type === "exact" && !/^\d{6}$/.test(normalizedValue)) {
    throw AppError.badRequest("Invalid pincode (6 digits)", "INVALID_PINCODE");
  }

  const warehouse = await Warehouse.findOne({ isActive: true });
  const warehouseId = warehouse?._id || null;

  try {
    const config = await ServiceabilityConfig.create({
      type,
      value: normalizedValue,
      isServiceable,
      warehouse: warehouseId,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Serviceability rule created successfully",
      data: config,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw AppError.conflict(
        "Serviceability rule already exists",
        "SERVICEABILITY_EXISTS",
      );
    }
    throw error;
  }
});
