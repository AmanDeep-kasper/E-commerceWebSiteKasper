import fs from "fs";
import path from "path";
import User from "../models/User.js"; // adjust the path if needed
import mongoose from "mongoose";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user._id; // `req.user` is set by `isAuthenticated` middleware i update this code
    const { name, dateOfBirth, gender, alternateMobile } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, dateOfBirth, gender, alternateMobile },
      { new: true }
    );

    res.status(200).json({ message: "Details updated", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update details" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      alternateMobile: user.alternateMobile,
      profileImage: user.profileImage, 
      role: user.role
    });
  } catch (err) {
    console.error("Error getting user details:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfileImage = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }


    // Local temp file path 
    // const localFilePath = req.file.path;


    const newImageName = req.file.filename;

     // Upload to Cloudinary
    const uploadResult = await uploadOnCloudinary(newImageName);

    if (!uploadResult) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }


    // ✅ Update only profileImage without triggering enum error
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      // { profileImage: newImageName },
      { profileImage: uploadResult.secure_url },
      { new: true, runValidators: false }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUserEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await User.findOne({ email });
    // if (existing && existing._id.toString() !== userId) {
    if (existing && existing._id.toString() !== userId.toString()) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email },
      { new: true }
    );

    res.status(200).json({ message: "Email updated", user: updatedUser });
  } catch (error) {
    console.error("Email update error:", error);
    res.status(500).json({ message: "Failed to update email" });
  }
};
