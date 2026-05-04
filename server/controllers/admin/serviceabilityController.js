import ServiceabilityConfig from "../../models/admin/serviceabilityConfig.js";
import Warehouse from "../../models/admin/WarehouseConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createServiceability = asyncHandler(async (req, res) => {
  let { type, value, isServiceable } = req.body;

  // validation
  if (type === "prefix" && !/^\d{2,4}$/.test(value)) {
    throw AppError.badRequest("Invalid prefix (2–4 digits)", "INVALID_PREFIX");
  }

  if (type === "exact" && !/^\d{6}$/.test(value)) {
    throw AppError.badRequest("Invalid pincode (6 digits)", "INVALID_PINCODE");
  }

  const warehouse = await Warehouse.findOne({ isActive: true });
  const warehouseId = warehouse?._id || null;

  const existingConfig = await ServiceabilityConfig.findOne({
    value,
    warehouse: warehouseId,
    isActive: true,
  });

  if (existingConfig) {
    throw AppError.conflict("Serviceability code already exists", "CONFLICT");
  }

  const config = await ServiceabilityConfig.create({
    type,
    value: value,
    isServiceable,
    warehouse: warehouseId,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Serviceability rule created successfully",
    data: config,
  });
});
