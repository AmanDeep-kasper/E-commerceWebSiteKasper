import Warehouse from "../../models/admin/WarehouseConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const upsertWarehouse = asyncHandler(async (req, res) => {
  let { name, phone, email, address } = req.body;

  if (address && typeof address === "string") {
    address = JSON.parse(address);
  }

  // Better duplicate check
  const warehouse = await Warehouse.findOne();

  if (!warehouse) {
    const newWarehouse = await Warehouse.create({
      name,
      phone,
      email,
      address,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      warehouse: newWarehouse,
    });
  }

  // Update existing
  const updated = await Warehouse.findOneAndUpdate(
    { _id: warehouse._id },
    {
      $set: {
        name,
        phone,
        email,
        address,
        isActive: true,
      },
    },
    { new: true, runValidators: true },
  ).lean();

  res.status(200).json({
    success: true,
    message: "Warehouse updated successfully",
    warehouse: updated,
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
