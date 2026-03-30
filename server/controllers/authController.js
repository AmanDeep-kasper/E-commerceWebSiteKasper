import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import dotenv from "dotenv";
import { sendMail } from "../nodemailer/test-email.js";
// import cookieParser from "cookie-parser";
dotenv.config();

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role?.trim().toLowerCase(),
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );
};

export const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;
    const profileImage = req.file ? req.file.filename : null;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name,Email and Password is required",
      });
    }

    // Prevent duplicate
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user in unverified state
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
      profileImage,
      emailVerificationOTP: otp,
      emailVerificationExpires: otpExpires,
      isVerified: false,
    });
    await user.save();

    const mailOptions = {
      from: `"LazerCut" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your verification OTP",
      html: `<p>Hi ${name},</p><p>Your signup OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    };

    await sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent to email", email });
  } catch (error) {
    console.error("registerUser error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // user verified in backend
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    // Compare password in bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      // accessToken,
      // refreshToken,
      // user: {
      //   id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   role: user.role?.trim().toLowerCase(),
      //   profileImage: user.profileImage,
      // },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save({ validateBeforeSave: false });
      }
    }

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `
        <p>You requested to reset your password.</p>
        <p><a href="${resetUrl}">Click here to reset</a></p>
      `,
    });

    return res.status(200).json({
      message: "Reset link sent to email.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const rawToken = req.params.token;
    const password = req.body.password;

    if (!rawToken || !password) {
      return res.status(400).json({
        message: "Token and new password are required",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token is invalid or expired.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (
      user.emailVerificationOTP !== otp ||
      user.emailVerificationExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpires = undefined;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return res.status(201).json({
      message: "Email verified and user registered",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.trim().toLowerCase(),
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access token refreshed",
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};
