import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOTP } from "../utils/generateOTP.js";
import {
  sendRegistrationEmail,
  sendPasswordResetEmail,
} from "../service/emailService.js";
import {
  blacklistToken,
  generateAuthTokens,
  generateResetToken,
  rotateTokens,
} from "../utils/token.js";
import env from "../config/env.js";
import { TempUser } from "../models/tempUser.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw AppError.conflict(
      "User with this email already exists",
      "EMAIL_EXISTS",
    );
  }

  // Remove stale temp record if present
  await TempUser.deleteOne({ email });

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await sendRegistrationEmail(email, otp);

  const tempUser = new TempUser({
    name,
    email,
    password,
    phoneNumber,
    role: "user",
    otp,
    lastOtpRequest: new Date(),
    otpAttempts: 1,
    otpExpires,
  });

  await tempUser.save();

  res.status(200).json({
    success: true,
    message: "OTP sent to email. Please verify within 10 minutes.",
    tempUserId: tempUser._id,
  });
});

export const resendOTP = asyncHandler(async (req, res) => {
  const { tempUserId } = req.body;

  const tempUser = await TempUser.findById(tempUserId);

  if (!tempUser) {
    throw AppError.notFound(
      "Session expired. Please register again.",
      "NOT_FOUND",
    );
  }

  const now = new Date();
  const MIN_TIME = 60 * 1000; // 1 min cooldown

  const timeSinceLast = now - (tempUser.lastOtpRequest || new Date(0));

  // Cooldown check
  if (timeSinceLast < MIN_TIME) {
    const waitTime = Math.ceil((MIN_TIME - timeSinceLast) / 1000);

    throw AppError.badRequest(
      `Please wait ${waitTime} seconds before requesting OTP again.`,
      "OTP_RATE_LIMIT",
    );
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  await sendRegistrationEmail(tempUser.email, otp);

  // Replace old OTP
  tempUser.otp = otp;
  tempUser.otpExpires = otpExpires;
  tempUser.lastOtpRequest = now;
  tempUser.otpAttempts = (tempUser.otpAttempts || 0) + 1;

  await tempUser.save();

  res.status(200).json({
    success: true,
    message: "OTP resent successfully",
  });
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { tempUserId, otp } = req.body;

  const tempUser = await TempUser.findById(tempUserId).select("+otp");

  if (!tempUser) {
    throw AppError.validation("Invalid or expired OTP", "INVALID_OTP");
  }

  if (tempUser.otpExpires < new Date()) {
    await TempUser.deleteOne({ _id: tempUserId });
    throw AppError.validation(
      "OTP has expired. Please register again.",
      "OTP_EXPIRED",
    );
  }

  const validOTP = await tempUser.compareOTP(otp);
  if (!validOTP) {
    throw AppError.validation("Invalid OTP", "INVALID_OTP");
  }

  const existingUser = await User.findOne({ email: tempUser.email });
  if (existingUser?.isVerified) {
    await TempUser.deleteOne({ _id: tempUserId });
    throw AppError.conflict(
      "User already exists and is verified",
      "USER_EXISTS",
    );
  }

  const user = new User({
    name: tempUser.name,
    email: tempUser.email,
    password: tempUser.password,
    role: tempUser.role,
    isVerified: true,
  });

  await user.save();
  await TempUser.deleteOne({ _id: tempUserId });

  res.status(201).json({
    success: true,
    message: "Email verified and user registered successfully",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const GENERIC_ERROR = "Invalid email or password";

  // Normalize identifier
  const cleanIdentifier = identifier?.trim().toLowerCase();

  let query = { isActive: true };

  if (cleanIdentifier.includes("@")) {
    query.email = cleanIdentifier;
  } else {
    query.phoneNumber = cleanIdentifier;
  }

  const user = await User.findOne(query).select(
    "+password +loginAttempts +lockUntil",
  );

  // Prevent timing attack
  if (!user) {
    await bcryptDummy(password);
    throw AppError.authentication(GENERIC_ERROR, "INVALID_CREDENTIALS");
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    const lockTimeRemaining = Math.ceil(
      (user.lockUntil - new Date()) / 1000 / 60,
    );
    throw AppError.badRequest(
      `Account is temporarily locked. Please try again after ${lockTimeRemaining} minutes`,
      "ACCOUNT_LOCKED",
    );
  }

  const isPasswordValid = await user.comparePassword(password);

  // Wrong password
  if (!isPasswordValid) {
    // Small delay
    await new Promise((r) => setTimeout(r, 300));

    const attempts = (user.loginAttempts || 0) + 1;
    const update = {
      $inc: { loginAttempts: 1 },
    };

    // Lock after 5 attempts
    if (attempts >= 5) {
      update.$set = {
        lockUntil: new Date(Date.now() + 30 * 60 * 1000),
      };

      console.warn({
        event: "ACCOUNT_LOCKED",
        userId: user._id,
        ip: req.ip,
      });
    }

    await User.updateOne({ _id: user._id }, update);

    console.warn({
      event: "LOGIN_FAILED",
      userId: user._id,
      ip: req.ip,
      attempts,
    });
    throw AppError.authentication(GENERIC_ERROR, "INVALID_CREDENTIALS");
  }

  const { accessToken, refreshToken, sessionId, expiresIn, tokenType } =
    await generateAuthTokens(user._id, user.role, req);

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        loginAttempts: 0,
        lockUntil: null,
        lastLogin: new Date(),
        lastLoginIP: req.ip || req.connection?.remoteAddress,
        lastLoginDevice: req.headers["user-agent"],
        currentSessionId: sessionId,
      },
    },
  );

  const isProduction = env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("sessionId", sessionId, {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message:
      user.role === "admin"
        ? "Admin logged in successfully"
        : "User logged in successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    session: {
      id: sessionId,
      expiresIn,
      tokenType,
    },
  });
});

// Constant-time dummy bcrypt compare to prevent user enumeration via timing
async function bcryptDummy(password) {
  const DUMMY_HASH =
    "$2b$12$invalidhashfortimingnormalizationpurposesonly............";
  try {
    await import("bcryptjs").then((b) =>
      b.default.compare(password, DUMMY_HASH),
    );
  } catch {
    // ignore — only here for timing normalization
  }
}

export const logoutUser = asyncHandler(async (req, res) => {
  const accessToken =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  const userId = req.user?.userId;
  const sessionId = req.user?.sessionId;
  const tokenId = req.user?.tokenId;

  const operations = [];

  if (accessToken) {
    const blacklisted = await blacklistToken(accessToken);
    operations.push({
      type: "access_token",
      status: blacklisted ? "blacklisted" : "failed",
    });

    if (blacklisted) {
      console.log(`Access token blacklisted: ${tokenId} for user: ${userId}`);
    }
  }

  if (refreshToken && userId && sessionId) {
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const result = await User.updateOne(
      {
        _id: userId,
        "refreshTokens.sessionId": sessionId,
        "refreshTokens.token": hashedRefreshToken,
        "refreshTokens.isRevoked": false,
      },
      {
        $set: {
          "refreshTokens.$.isRevoked": true,
          "refreshTokens.$.revokedAt": new Date(),
        },
      },
    );

    if (result.modifiedCount > 0) {
      operations.push({ type: "refresh_token", status: "invalidated" });
    } else {
      const sessionResult = await User.updateOne(
        { _id: userId, "refreshTokens.sessionId": sessionId },
        {
          $set: {
            "refreshTokens.$.isRevoked": true,
            "refreshTokens.$.revokedAt": new Date(),
          },
        },
      );
      operations.push({
        type: "refresh_token",
        status: sessionResult.modifiedCount > 0 ? "invalidated" : "not_found",
      });
    }
  } else if (refreshToken && !userId) {
    try {
      const decoded = jwt.decode(refreshToken);
      if (decoded?.userId && decoded?.sessionId) {
        const hashedRefreshToken = crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex");

        await User.updateOne(
          {
            _id: decoded.userId,
            "refreshTokens.sessionId": decoded.sessionId,
            "refreshTokens.token": hashedRefreshToken,
          },
          {
            $set: {
              "refreshTokens.$.isRevoked": true,
              "refreshTokens.$.revokedAt": new Date(),
            },
          },
        );
        operations.push({
          type: "refresh_token",
          status: "invalidated_from_decode",
        });
      }
    } catch (decodeError) {
      console.error("Error decoding refresh token:", decodeError);
      operations.push({ type: "refresh_token", status: "decode_failed" });
    }
  }

  if (userId && sessionId) {
    await User.updateOne({ _id: userId }, { $unset: { currentSessionId: "" } });
    operations.push({ type: "current_session", status: "cleared" });
  }

  const isProduction = env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    path: "/",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.clearCookie("sessionId", { ...cookieOptions, httpOnly: false });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: {
      operations,
      timestamp: new Date().toISOString(),
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const currentSessionId = req.user?.sessionId;

  // Validate session is still active (use only exclusion projection)
  const user = await User.findById(userId).select(
    "-password -refreshTokens -resetPasswordToken -resetPasswordExpires -lastLogin -loginAttempts -lockUntil -lastLoginDevice -lastLoginIP -resetPasswordAttempts",
  );

  if (!user) {
    throw AppError.notFound("User not found or inactive", "USER_NOT_FOUND");
  }

  // Check if session is still valid
  if (!user.currentSessionId) {
    throw AppError.authentication(
      "Your session has been invalidated. Please login again.",
      "SESSION_INVALIDATED",
    );
  }

  // Verify session ID matches (prevents using old tokens after password change)
  if (user.currentSessionId.toString() !== currentSessionId) {
    throw AppError.authentication(
      "Invalid session. Please login again.",
      "INVALID_SESSION",
    );
  }

  if (!user.isActive) {
    throw AppError.authentication(
      "Your account has been deactivated.",
      "ACCOUNT_DEACTIVATED",
    );
  }

  // Return user data without sensitive fields
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    isVerified: user.isVerified,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(200).json({
    success: true,
    message: "User data fetched successfully",
    user: userResponse,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const currentSessionId = req.user?.sessionId;
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    throw AppError.badRequest(
      "New password must be different from old password",
      "SAME_PASSWORD",
    );
  }

  const user = await User.findById(userId).select("+password +refreshTokens");
  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw AppError.authentication("Invalid old password", "INVALID_PASSWORD");
  }

  user.password = newPassword;

  // 🔐 Logout all OTHER sessions (keep current session active)
  const revokedCount = user.refreshTokens?.length || 0;

  user.refreshTokens = user.refreshTokens.map((token) => {
    if (token.sessionId !== currentSessionId) {
      return {
        ...token.toObject(),
        isRevoked: true,
        revokedAt: new Date(),
        revokeReason: "PASSWORD_CHANGED", // Track reason for logout
      };
    }
    return token;
  });

  await user.save();

  // Issue fresh tokens for the current session
  const { accessToken, refreshToken, sessionId } = await generateAuthTokens(
    userId,
    user.role,
    req,
  );

  // Update currentSessionId in DB when new session is created
  await User.updateOne(
    { _id: userId },
    { $set: { currentSessionId: sessionId } },
  );

  const isProduction = env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  console.log(
    `🔐 Password changed for user: ${userId} | ${revokedCount - 1} other session(s) logged out`,
  );

  res.status(200).json({
    success: true,
    message:
      "Password changed successfully. Other devices have been logged out.",
    data: {
      otherSessionsLoggedOut: Math.max(0, revokedCount - 1),
    },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const clientIP =
    req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const user = await User.findOne({ email, isActive: true }).select(
    "_id email name isActive resetPasswordAttempts lastResetRequest resetPasswordExpires",
  );

  if (!user) {
    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  }

  const now = new Date();
  const resetAttempts = user.resetPasswordAttempts || 0;
  const lastRequest = user.lastResetRequest || new Date(0);
  const timeSinceLastRequest = now - lastRequest;
  const MIN_TIME_BETWEEN_REQUESTS = 60 * 1000;

  if (resetAttempts >= 3 && timeSinceLastRequest < 60 * 60 * 1000) {
    console.warn(`Password reset rate limit hit for email: ${email}`);
    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  }

  if (timeSinceLastRequest < MIN_TIME_BETWEEN_REQUESTS) {
    const waitTime = Math.ceil(
      (MIN_TIME_BETWEEN_REQUESTS - timeSinceLastRequest) / 1000,
    );
    throw AppError.badRequest(
      `Please wait ${waitTime} seconds before requesting another reset link.`,
      "RATE_LIMIT_EXCEEDED",
    );
  }

  // 🔥 Allow new reset after cooldown (invalidate old token)
  if (user.resetPasswordExpires && user.resetPasswordExpires > now) {
    console.warn(`Invalidating old reset token for: ${email}`);

    // Invalidate old token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
  }

  const { resetToken, hashedToken } = generateResetToken();
  const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = tokenExpiry;
  user.resetPasswordAttempts = resetAttempts + 1;
  user.lastResetRequest = now;
  user.lastResetRequestIP = clientIP;
  user.lastResetRequestDevice = userAgent;

  await user.save({ validateBeforeSave: false });

  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  // Non-blocking email send — failures logged but don't affect response
  sendPasswordResetEmail(user.email, user.name, resetLink, tokenExpiry).catch(
    (emailError) => {
      console.error(
        `Failed to send password reset email to ${email}:`,
        emailError,
      );
    },
  );

  res.status(200).json({
    success: true,
    message:
      "If an account with that email exists, a reset link has been sent.",
    ...(env.NODE_ENV === "development" && {
      debug: { resetToken, resetLink },
    }),
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  const { token } = req.params;

  if (newPassword !== confirmPassword) {
    throw AppError.badRequest(
      "New password and confirm password do not match",
      "PASSWORD_MISMATCH",
    );
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
    isActive: true,
  }).select(
    "+password +refreshTokens +resetPasswordToken +resetPasswordExpires",
  );

  if (!user) {
    throw AppError.badRequest(
      "Invalid or expired reset token. Please request a new password reset link.",
      "INVALID_RESET_TOKEN",
    );
  }

  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) {
    throw AppError.badRequest(
      "New password must be different from your current password",
      "SAME_PASSWORD",
    );
  }

  if (user.refreshTokens?.length > 0) {
    user.refreshTokens = user.refreshTokens.map((t) => ({
      ...t.toObject(),
      isRevoked: true,
      revokedAt: new Date(),
      revokeReason: "PASSWORD_RESET", // Track reason for logout
    }));
  }

  // Update password and clear all security-related fields
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.resetPasswordAttempts = 0;
  user.lastResetRequest = undefined;
  user.currentSessionId = undefined; // Clear current session

  // Track password change
  user.lastPasswordChange = new Date();
  user.lastPasswordChangeIP = req.ip || req.connection?.remoteAddress;
  user.lastPasswordChangeDevice = req.headers["user-agent"];

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful.",
  });
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw AppError.authentication("Refresh token required", "NO_REFRESH_TOKEN");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw AppError.authentication(
        "Refresh token expired. Please login again.",
        "REFRESH_TOKEN_EXPIRED",
      );
    }
    throw AppError.authentication(
      "Invalid refresh token",
      "INVALID_REFRESH_TOKEN",
    );
  }

  const user = await User.findById(decoded.userId).select("role isActive");
  if (!user || !user.isActive) {
    throw AppError.notFound("User not found or inactive", "USER_NOT_FOUND");
  }

  const newTokens = await rotateTokens(
    decoded.userId,
    user.role,
    refreshToken,
    req,
  );

  // Update currentSessionId after token rotation
  await User.updateOne(
    { _id: decoded.userId },
    { $set: { currentSessionId: newTokens.sessionId } },
  );

  const isProduction = env.NODE_ENV === "production";

  res.cookie("accessToken", newTokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", newTokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("sessionId", newTokens.sessionId, {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    data: {
      expiresIn: newTokens.expiresIn,
      tokenType: newTokens.tokenType,
      sessionId: newTokens.sessionId,
    },
  });
});
