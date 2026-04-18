import fs from "fs";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploader.js";
import {
  sendEmailChangeOTP,
  sendSupportEmail,
} from "../service/emailService.js";
import TempUser from "../models/TempUser.js";
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
      defaultAddress: user.defaultAddress,
      lastLogin: user.lastLogin,
      lastLoginDevice: user.lastLoginDevice,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { name, dateOfBirth, gender, phoneNumber } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw AppError.unauthorized("Unauthorized user", "NO_USER");
  }

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
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

  const removeImage = req.body?.removeImage === "true";

  // 🔥 CASE 1: Remove image
  if (removeImage) {
    if (user.profileImage?.publicId) {
      await deleteFromCloudinary(user.profileImage.publicId);
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
  if (!req.file) {
    throw AppError.badRequest("No file provided", "FILE_REQUIRED");
  }

  try {
    // 🔥 Delete old image (cloudinary)
    if (user.profileImage?.publicId) {
      await deleteFromCloudinary(user.profileImage.publicId);
    }

    // 🔥 Upload new image
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.fileType,
      req.fileType === "image" ? "images" : "videos",
      req.file.originalname,
    );

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
  } catch (error) {
    // 🔥 rollback cloudinary if DB fails
    if (cloudinaryResult?.publicId) {
      await deleteFromCloudinary(cloudinaryResult.publicId);
    }
    throw error;
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

// Admin controllers
export const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = "",
    role,
    isVerified,
    isActive,
  } = req.query;

  const query = {};

  // 🔍 Search (name, email, phoneNumber)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } },
    ];
  }

  // 🎯 Filters
  if (role) {
    query.role = role;
  }

  if (isVerified !== undefined) {
    query.isVerified = isVerified === "true";
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  // 📊 Pagination
  const skip = (Number(page) - 1) * Number(limit);

  const [users, totalUsers] = await Promise.all([
    User.find(query)
      .select(
        "_id name email phoneNumber isVerified role profileImage dateOfBirth gender defaultAddress isActive lastLogin lastLoginDevice lastLoginIP loginAttempts",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),

    User.countDocuments(query),
  ]);

  // 📦 Response
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users,
    pagination: {
      totalUsers,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      limit: Number(limit),
    },
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // ✅ Fetch user (exclude sensitive fields)
  const user = await User.findById(userId)
    .select(
      "-password -refreshTokens -currentSessionId -resetPasswordAttempts -lastResetRequest -lastResetRequestIP -lastResetRequestDevice -lastPasswordChange -lastPasswordChangeIP -lastPasswordChangeDevice -lockUntil",
    )
    .lean();

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  // 🚫 Prevent self delete
  if (req.user?.userId.toString() === userId.toString()) {
    throw AppError.badRequest("You cannot delete your own account");
  }

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  // 🚫 Prevent self deactivation
  if (req.user?.userId.toString() === userId.toString()) {
    throw AppError.badRequest("You cannot deactivate your own account");
  }

  user.isActive = !user.isActive;
  await user.save();

  return res.status(200).json({
    success: true,
    message: `User ${
      user.isActive ? "activated successfully" : "deactivated successfully"
    }`,
  });
});

// Helper function to generate unique request ID
function generateRequestId() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${timestamp}${random}`;
}

export const sendSupportMessage = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;

  const { message } = req.body;

  if (!message) {
    throw AppError.badRequest("Message is required", "MESSAGE_REQUIRED");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  // generate request id
  const requestId = generateRequestId();

  await sendSupportEmail(user.email, user.name, message, requestId);

  res.status(200).json({
    success: true,
    message: "Support request sent successfully",
    requestId,
  });
});
