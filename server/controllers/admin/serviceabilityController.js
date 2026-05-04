import Serviceability from "../../models/admin/serviceabilityConfig.js";
import Warehouse from "../../models/admin/WarehouseConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createServiceability = asyncHandler(async (req, res) => {
  let { type, value, isServiceable } = req.body;

  value = String(value).trim();

  // validation
  if (type === "prefix" && !/^\d{2,4}$/.test(value)) {
    throw AppError.badRequest("Invalid prefix (2–4 digits)", "INVALID_PREFIX");
  }

  if (type === "exact" && !/^\d{6}$/.test(value)) {
    throw AppError.badRequest("Invalid pincode (6 digits)", "INVALID_PINCODE");
  }

  const warehouse = await Warehouse.findOne({ isActive: true });
  const warehouseId = warehouse?._id || null;

  // FIXED duplicate check
  const existingConfig = await Serviceability.findOne({
    value,
    type,
    warehouse: warehouseId,
    isActive: true,
  });

  if (existingConfig) {
    throw AppError.conflict(
      "Serviceability code already exists",
      "SERVICEABILITY_EXISTS",
    );
  }

  const config = await Serviceability.create({
    type,
    value,
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

export const checkServiceability = asyncHandler(async (req, res) => {
  let { pincode } = req.body;

  if (!/^\d{6}$/.test(pincode)) {
    throw AppError.badRequest("Invalid pincode", "INVALID_PINCODE");
  }

  pincode = String(pincode);

  // build prefixes (longest first)
  const prefixes = [
    pincode.slice(0, 4),
    pincode.slice(0, 3),
    pincode.slice(0, 2),
  ];

  // SINGLE QUERY (FASTEST)
  const configs = await Serviceability.find({
    isActive: true,
    $or: [
      { type: "exact", value: pincode },
      { type: "prefix", value: { $in: prefixes } },
    ],
  })
    .sort({ type: -1, value: -1 }) // exact first, then longest prefix
    .lean();

  if (!configs.length) {
    return res.status(200).json({
      success: true,
      data: {
        isServiceable: false,
        reason: "No service available for this pincode",
      },
    });
  }

  // 🔥 priority: exact > longest prefix
  const bestMatch = configs[0];

  res.status(200).json({
    success: true,
    message: "We are serving to this pincode",
    data: {
      isServiceable: bestMatch.isServiceable,
      matchedOn: bestMatch.type,
      value: bestMatch.value,
    },
  });
});

export const getAllServiceability = asyncHandler(async (req, res) => {
  const { type, isActive, page = 1, limit = 20, search = "" } = req.query;

  const skip = (page - 1) * limit;

  const filter = {};

  if (type) filter.type = type;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  if (search) {
    filter.value = { $regex: search, $options: "i" };
  }

  const [data, total] = await Promise.all([
    Serviceability.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),

    Serviceability.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Serviceability configs fetched successfully",
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const updateServiceability = asyncHandler(async (req, res) => {
  const { serviceabilityId } = req.params;
  let { value, isServiceable } = req.body;

  const existing = await Serviceability.findById(serviceabilityId);

  if (!existing) {
    throw AppError.notFound("Config not found", "NOT_FOUND");
  }

  if (value) {
    value = String(value).trim();

    if (existing.type === "prefix" && !/^\d{2,4}$/.test(value)) {
      throw AppError.badRequest("Invalid prefix", "INVALID_PREFIX");
    }

    if (existing.type === "exact" && !/^\d{6}$/.test(value)) {
      throw AppError.badRequest("Invalid pincode", "INVALID_PINCODE");
    }

    existing.value = value;
  }

  if (isServiceable !== undefined) {
    existing.isServiceable = isServiceable;
  }

  await existing.save();

  res.status(200).json({
    success: true,
    message: "Serviceability config updated successfully",
    data: existing,
  });
});

export const toggleServiceability = asyncHandler(async (req, res) => {
  const { serviceabilityId } = req.params;

  const config = await Serviceability.findById(serviceabilityId);

  if (!config) {
    throw AppError.notFound("Config not found", "NOT_FOUND");
  }

  config.isActive = !config.isActive;
  await config.save();

  res.status(200).json({
    success: true,
    message: `Serviceability config ${config.isActive ? "activated" : "deactivated"} successfully`,
    data: config,
  });
});
