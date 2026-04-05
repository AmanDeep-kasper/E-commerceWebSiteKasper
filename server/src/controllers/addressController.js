import Address from "../models/Address.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Create address
export const addAddress = asyncHandler(async (req, res) => {
  const { name, email, tag, street, city, state, phone, zip, isDefault } =
    req.body;
  const userId = req.user;

  // If this new address is default → remove default from others
  if (isDefault) {
    await Address.updateMany(
      { userId, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  const newAddress = await Address.create({
    userId,
    name,
    email,
    tag,
    street,
    city,
    state,
    phone,
    zip,
    isDefault: !!isDefault,
  });

  res.status(201).json({
    message: "Address added successfully",
    data: newAddress,
  });
});

// Get all addresses for user
export const getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ userId: req.user });
  res.status(200).json(addresses);
});

// Update address
export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isDefault, ...updateData } = req.body;

  // If making this one default → unset others
  if (isDefault) {
    const current = await Address.findById(id);
    if (current) {
      await Address.updateMany(
        { userId: current.userId, _id: { $ne: id } },
        { $set: { isDefault: false } }
      );
    }
  }

  const updated = await Address.findByIdAndUpdate(
    id,
    { ...updateData, ...(isDefault !== undefined && { isDefault }) },
    { new: true }
  );

  res.json({
    message: "Address updated successfully",
    data: updated,
  });
});

// Delete address
export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Address.findByIdAndDelete(id);
  res.status(200).json({ message: "Address deleted" });
});
