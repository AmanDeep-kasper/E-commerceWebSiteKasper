import fs from "fs";
import path from "path";
import User from "../models/User.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const updateUserDetails = asyncHandler(async (req, res) => {
  if (req.user.role !== "user") {
    throw AppError.authorization(
      "Admin is not allowed to update details from this route",
      "FORBIDDEN"
    );
  }

  const userId = req.user._id;
  const { name, dateOfBirth, gender, alternateMobile } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, dateOfBirth, gender, alternateMobile },
    { new: true, runValidators: true },
  );

  res.status(200).json({ message: "Details updated", user: updatedUser });
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  res.status(200).json({
    name: user.name,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    alternateMobile: user.alternateMobile,
    profileImage: user.profileImage,
    role: user.role,
  });
});

export const updateUserProfileImage = asyncHandler(async (req, res) => {
  if (req.user.role !== "user") {
    throw AppError.authorization(
      "Admin is not allowed to update profile image from this route",
      "FORBIDDEN"
    );
  }

  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw AppError.badRequest("Invalid user ID", "INVALID_USER_ID");
  }

  if (!req.file) {
    throw AppError.badRequest("No image uploaded", "FILE_REQUIRED");
  }

  const localFilePath = path.resolve("uploads", req.file.filename);

  const uploadUrl = await uploadOnCloudinary(localFilePath);

  if (!uploadUrl) {
    throw AppError.internal("Cloudinary upload failed", "CLOUDINARY_ERROR");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profileImage: uploadUrl },
    { new: true, runValidators: false },
  );

  res.status(200).json({
    message: "Profile image updated successfully",
    profileImage: updatedUser.profileImage,
  });
});

export const updateUserEmail = asyncHandler(async (req, res) => {
  if (req.user.role !== "user") {
    throw AppError.authorization(
      "Admin is not allowed to update email from this route",
      "FORBIDDEN"
    );
  }

  const userId = req.user._id;
  const { email } = req.body;

  if (!email) {
    throw AppError.validation("Email is required", "EMAIL_REQUIRED");
  }

  const existing = await User.findOne({ email });

  if (existing && existing._id.toString() !== userId.toString()) {
    throw AppError.conflict("Email already in use", "EMAIL_EXISTS");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { email: email.trim().toLowerCase() },
    { new: true, runValidators: true },
  );

  res.status(200).json({ message: "Email updated", user: updatedUser });
});
