import Address from "../models/Address.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import User from "../models/User.js";

export const addAddress = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    email,
    address,
    city,
    state,
    pinCode,
    addressType,
    country,
    isDefault,
  } = req.body;

  const userId = req.user?.userId;

  if (isDefault === true) {
    await Address.updateMany({ userId }, { $set: { isDefault: false } });
  }

  const newAddress = await Address.create({
    userId,
    fullName,
    phone,
    email,
    address,
    city,
    state,
    pinCode,
    addressType,
    country,
    isDefault: Boolean(isDefault),
  });

  await User.findByIdAndUpdate(userId, {
    $set: { defaultAddress: newAddress._id },
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    data: newAddress,
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user?.userId;

  const address = await Address.findById(addressId);

  if (!address) {
    throw AppError.notFound("Address not found", "NOT_FOUND");
  }

  if (address.userId.toString() !== userId.toString()) {
    throw AppError.authorization(
      "You are not authorized to update this address",
      "NOT_AUTHORIZED",
    );
  }

  if (req.body.fullName !== undefined) address.fullName = req.body.fullName;
  if (req.body.phone !== undefined) address.phone = req.body.phone;
  if (req.body.email !== undefined) address.email = req.body.email;
  if (req.body.address !== undefined) address.address = req.body.address;
  if (req.body.city !== undefined) address.city = req.body.city;
  if (req.body.state !== undefined) address.state = req.body.state;
  if (req.body.pinCode !== undefined) address.pinCode = req.body.pinCode;
  if (req.body.addressType !== undefined)
    address.addressType = req.body.addressType;
  if (req.body.country !== undefined) address.country = req.body.country;

  if (req.body.isDefault === true) {
    // Make all other addresses non-default
    await Address.updateMany({ userId }, { $set: { isDefault: false } });

    address.isDefault = true;
  }

  // ❌ Prevent removing default without replacement
  if (req.body.isDefault === false) {
    if (address.isDefault) {
      throw AppError.badRequest(
        "You cannot remove default status. Please select another address as default first.",
        "DEFAULT_ADDRESS_REQUIRED",
      );
    }
  }

  const updatedAddress = await address.save();

  // update user default address
  const user = await User.findById(userId);
  user.defaultAddress = updatedAddress._id;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: updatedAddress,
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user?.userId;
  const address = await Address.findById(addressId);

  if (!address) {
    throw AppError.notFound("Address not found", "NOT_FOUND");
  }

  if (address.userId.toString() !== userId.toString()) {
    throw AppError.authorization(
      "You are not authorized to delete this address",
      "NOT_AUTHORIZED",
    );
  }

  // check is default
  if (address.isDefault) {
    throw AppError.badRequest(
      "You cannot delete default address. Please select another address as default first.",
      "DEFAULT_ADDRESS_REQUIRED",
    );
  }

  await address.deleteOne();

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

export const getAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user?.userId;
  const address = await Address.findById(addressId);

  if (!address) {
    throw AppError.notFound("Address not found", "NOT_FOUND");
  }

  if (address.userId.toString() !== userId.toString()) {
    throw AppError.authorization(
      "You are not authorized to access this address",
      "NOT_AUTHORIZED",
    );
  }

  res.status(200).json({
    success: true,
    message: "Address fetched successfully",
    data: address,
  });
});

export const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const addressType = req.query.addressType;

  const skip = (page - 1) * limit;

  const filter = { userId };

  if (addressType) {
    filter.addressType = addressType;
  }

  // 🔹 Fetch addresses (default on top)
  const addresses = await Address.find(filter)
    .sort({ isDefault: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Address.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: "Addresses fetched successfully",
    data: {
      addresses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user?.userId;

  const address = await Address.findById(addressId);

  if (!address) {
    throw AppError.notFound("Address not found", "NOT_FOUND");
  }

  if (address.userId.toString() !== userId.toString()) {
    throw AppError.authorization(
      "You are not authorized to change default address",
      "NOT_AUTHORIZED",
    );
  }

  // check if already defult
  if (address.isDefault) {
    throw AppError.badRequest(
      "This address is already set as default",
      "ALREADY_DEFAULT",
    );
  }

  await Address.updateMany({ userId }, { $set: { isDefault: false } });

  address.isDefault = true;
  const updatedAddress = await address.save();

  await User.findByIdAndUpdate(userId, {
    $set: { defaultAddress: updatedAddress._id },
  });

  res.status(200).json({
    success: true,
    message: "Default address updated successfully",
    data: updatedAddress,
  });
});

export const updateAddressStatus = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.user?.userId;

  const address = await Address.findById(addressId);

  if (!address) {
    throw AppError.notFound("Address not found", "NOT_FOUND");
  }

  if (address.userId.toString() !== userId.toString()) {
    throw AppError.authorization(
      "You are not authorized to change default address",
      "NOT_AUTHORIZED",
    );
  }

  address.isActive = !address.isActive;
  await address.save();

  res.status(200).json({
    success: true,
    message: `Address ${
      address.isActive ? "activated" : "deactivated"
    } successfully`,
    address,
  });
});
