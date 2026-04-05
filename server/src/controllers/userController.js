import fs from "fs";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";
import { sendEmailChangeOTP } from "../service/emailService.js";
import { TempUser } from "../models/tempUser.js";
import { generateOTP } from "../utils/generateOTP.js";

export const getUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw AppError.unauthorized("Unauthorized user", "NO_USER");
  }

  const user = await User.findById(userId).lean();

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      profileImage: user.profileImage,
      isActive: user.isActive,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { name, dob, gender, phoneNumber } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw AppError.unauthorized("Unauthorized user", "NO_USER");
  }

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (dob !== undefined) updateData.dateOfBirth = dob;
  if (gender !== undefined) updateData.gender = gender;
  if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select(
    "_id name email role profileImage isActive phoneNumber dateOfBirth gender createdAt updatedAt isVerified",
  );

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "User details updated successfully",
    user,
  });
});

export const updateUserProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw AppError.unauthorized("Unauthorized user", "NO_USER");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  const newImagePath = req.file?.path;
  const removeImage = req.body?.removeImage === "true";

  // 🔥 CASE 1: Remove image
  if (removeImage) {
    if (user.profileImage?.publicId) {
      await deleteImageFromCloudinary(user.profileImage.publicId);
    }

    user.profileImage = { publicId: "", url: "" };
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
        profileImage: user.profileImage,
        isActive: user.isActive,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  // ❌ No file
  if (!newImagePath) {
    throw AppError.badRequest("No file provided", "FILE_REQUIRED");
  }

  try {
    // 🔥 Delete old image (cloudinary)
    if (user.profileImage?.publicId) {
      await deleteImageFromCloudinary(user.profileImage.publicId);
    }

    // 🔥 Upload new image
    const cloudinaryResult = await uploadImageToCloudinary(newImagePath);

    user.profileImage = {
      publicId: cloudinaryResult.publicId,
      url: cloudinaryResult.url,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
        profileImage: user.profileImage,
        isActive: user.isActive,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } finally {
    // 🧹 ALWAYS delete local file (IMPORTANT 🔥)
    if (newImagePath && fs.existsSync(newImagePath)) {
      fs.unlinkSync(newImagePath);
    }
  }
});

export const updateUserEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userId = req.user?.userId;

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  // same email check
  if (user.email === email) {
    throw AppError.badRequest("New email must be different", "SAME_EMAIL");
  }

  // check duplicate email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw AppError.conflict("Email already registered", "EMAIL_EXISTS");
  }

  // generate email verification otp
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await sendEmailChangeOTP(email, otp, user.name);

  const tempOtp = await TempUser.findOne({ email });
  if (tempOtp) {
    await TempUser.deleteOne({ email });
  }

  const tempUser = await TempUser.create({
    name: user.name,
    email: email,
    password: user.password,
    role: user.role,
    otp,
    otpExpires,
  });

  res.status(200).json({
    success: true,
    message: "OTP sent to email. Please verify within 10 minutes.",
    tempUserId: tempUser._id,
  });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { tempUserId, otp } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }
  const tempUser = await TempUser.findById(tempUserId).select("+otp");

  if (!tempUser) {
    throw AppError.validation("Invalid or expired OTP", "INVALID_OTP");
  }

  if (tempUser.otpExpires < new Date()) {
    await TempUser.deleteOne({ _id: tempUserId });
    throw AppError.validation(
      "OTP has expired. Please resend again.",
      "OTP_EXPIRED",
    );
  }

  const validOTP = await tempUser.compareOTP(otp);
  if (!validOTP) {
    throw AppError.validation("Invalid OTP", "INVALID_OTP");
  }

  user.email = tempUser.email;
  user.isVerified = true;

  await user.save();
  await TempUser.deleteOne({ _id: tempUserId });

  res.status(200).json({
    success: true,
    message: "Email verified and user updated successfully",
  });
});
