import Warehouse from "../../models/admin/WarehouseConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createWarehouse = asyncHandler(async (req, res) => {
  const { name, phone, email, address } = req.body;
  const userId = req.user?.userId;

  // Better duplicate check
  const existing = await Warehouse.findOne({
    userId,
  });

  if (existing) {
    throw AppError.conflict("Warehouse already exists", "ALREADY_EXISTS");
  }

  const warehouse = await Warehouse.create({
    userId,
    name,
    phone,
    email,
    address,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Warehouse created successfully",
    warehouse,
  });
});

export const updateWarehouse = asyncHandler(async (req, res) => {
  const { name, phone, email, address } = req.body;
  const userId = req.user?.userId;

  const warehouse = await Warehouse.findOne({
    userId,
    isActive: true,
  });

  if (!warehouse) {
    throw AppError.notFound("Warehouse not found", "NOT_FOUND");
  }

  if (name !== undefined) warehouse.name = name;
  if (phone !== undefined) warehouse.phone = phone;
  if (email !== undefined) warehouse.email = email;
  if (address !== undefined) warehouse.address = address;

  await warehouse.save();

  res.status(200).json({
    success: true,
    message: "Warehouse updated successfully",
    warehouse,
  });
});

export const getWarehouse = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const warehouse = await Warehouse.findOne({
    userId,
    isActive: true,
  }).lean();

  if (!warehouse) {
    throw AppError.notFound("Warehouse not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Warehouse fetched successfully",
    warehouse,
  });
});
