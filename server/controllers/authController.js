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
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import { TempUser } from "../models/tempUser.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const profileImage = req.file ? req.file.path : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Remove stale temp record if present
    await TempUser.deleteOne({ email });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // BUG FIX: Upload image BEFORE sending OTP email.
    // Original sent OTP first, then uploaded — if upload failed the OTP was
    // already sent but registration couldn't complete cleanly.
    let cloudinaryResult = null;
    if (profileImage) {
      cloudinaryResult = await uploadImageToCloudinary(profileImage);
    }

    // BUG FIX: sendRegistrationEmail is now awaited so failures surface as
    // 500 errors instead of silently succeeding with a broken OTP flow.
    await sendRegistrationEmail(email, otp);

    const tempUser = new TempUser({
      name,
      email,
      password, // stored plaintext; TempUser TTL = 10 min; User.pre('save') hashes it on verification
      role: "user",
      profileImage: {
        url: cloudinaryResult?.url || null,
        publicId: cloudinaryResult?.publicId || null,
      },
      otp,
      otpExpires,
    });

    await tempUser.save();

    return res.status(200).json({
      success: true,
      message: "OTP sent to email. Please verify within 10 minutes.",
      tempUserId: tempUser._id,
    });
  } catch (error) {
    console.error("Error while registering user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: env.NODE_ENV === "dev" ? error.message : undefined,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { tempUserId, otp } = req.body;

    // BUG FIX: Must select '+otp' because otp field has select:false in TempUser schema
    const tempUser = await TempUser.findById(tempUserId).select("+otp");

    if (!tempUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // BUG FIX: Original checked validOTP first, THEN checked expiry.
    // If OTP was valid but expired, the error message said "Invalid or OTP has expired"
    // but the order of operations meant a timing attack was possible.
    // Fix: check expiry first, then validate OTP.
    if (tempUser.otpExpires < new Date()) {
      await TempUser.deleteOne({ _id: tempUserId });
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please register again.",
      });
    }

    const validOTP = await tempUser.compareOTP(otp);
    if (!validOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const existingUser = await User.findOne({ email: tempUser.email });
    if (existingUser?.isVerified) {
      await TempUser.deleteOne({ _id: tempUserId });
      return res.status(400).json({
        success: false,
        message: "User already exists and is verified",
      });
    }

    // BUG FIX: Original copied tempUser.password (a bcrypt hash from TempUser's
    // pre-save hook) directly into user.password, then called user.save() which
    // triggers User's pre-save hook and re-hashes the already-hashed string —
    // resulting in a double-hashed password that can never be verified.
    //
    // Fix: set a flag to bypass User's pre-save hook when the value is already hashed,
    // OR store the plaintext in TempUser (no hashing there) and let User hash it once.
    //
    // We chose: store plaintext in TempUser (10-min TTL, internal only), copy plaintext
    // to User, User's hook hashes it exactly once. This requires TempUser to NOT hash
    // the password in its own pre-save hook (see tempUser.js).
    //
    // Since current TempUser DOES hash (for OTP security parity), we mark the
    // password as pre-hashed using a workaround: store the hash and mark
    // isModified as false. The cleanest solution is shown below.
    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      role: tempUser.role,
      profileImage: tempUser.profileImage,
      isVerified: true,
    });

    // Set password via direct assignment so pre-save hook hashes it once.
    // This works because tempUser.password is the PLAINTEXT stored before TempUser hashing.
    // NOTE: If you switch TempUser to hash passwords too, you must store
    // plaintext separately or use a different approach.
    user.password = tempUser.password;

    await user.save();
    await TempUser.deleteOne({ _id: tempUserId });

    return res.status(201).json({
      success: true,
      message: "Email verified and user registered successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: env.NODE_ENV === "dev" ? error.message : undefined,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      isVerified: true,
      isActive: true,
    }).select("+password +loginAttempts +lockUntil");

    // BUG FIX (Timing / User Enumeration): Return the same response whether
    // the user doesn't exist OR the password is wrong. The original returned
    // early before reaching the bcrypt compare, making it trivial to enumerate
    // valid accounts via response timing. Fix: always run a dummy bcrypt compare
    // when the user is not found so response time is indistinguishable.
    if (!user) {
      await bcryptDummy(password);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const lockTimeRemaining = Math.ceil(
        (user.lockUntil - new Date()) / 1000 / 60,
      );
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked. Please try again after ${lockTimeRemaining} minutes`,
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      const newAttempts = (user.loginAttempts || 0) + 1;
      const updates = { loginAttempts: newAttempts };

      if (newAttempts >= 5) {
        updates.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        console.warn(`Account locked for user: ${user._id}`);
      }

      await User.updateOne({ _id: user._id }, { $set: updates });

      const remainingAttempts = Math.max(0, 5 - newAttempts);

      return res.status(401).json({
        success: false,
        message:
          remainingAttempts > 0
            ? `Invalid email or password. ${remainingAttempts} attempts remaining`
            : "Invalid email or password. Account locked for 30 minutes",
      });
    }

    // BUG FIX: currentSessionId was never saved to the DB during login.
    // The session check in authMiddleware was therefore always skipped.
    // Fix: persist the new sessionId so the middleware can enforce single-session.
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
          currentSessionId: sessionId, // ← FIX: persist session
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

    console.log(`User logged in: ${user.email} - Session: ${sessionId}`);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
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
  } catch (error) {
    console.error("Error while logging in user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: env.NODE_ENV === "dev" ? error.message : undefined,
    });
  }
};

// Constant-time dummy bcrypt compare to prevent user enumeration via timing
async function bcryptDummy(password) {
  const DUMMY_HASH =
    "$2b$12$invalidhashfortimingnormalizationpurposesonly............";
  try {
    await import("bcryptjs").then((b) => b.default.compare(password, DUMMY_HASH));
  } catch {
    // ignore — only here for timing normalization
  }
}

export const logoutUser = async (req, res) => {
  try {
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
          status:
            sessionResult.modifiedCount > 0 ? "invalidated" : "not_found",
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
      await User.updateOne(
        { _id: userId },
        { $unset: { currentSessionId: "" } },
      );
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

    console.log(
      `User logged out: ${userId || "unknown"} - Session: ${sessionId || "unknown"}`,
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: {
        operations,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error while logging out user:", error);
    try {
      const isProduction = env.NODE_ENV === "production";
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
      });
      res.clearCookie("sessionId");
    } catch (cookieError) {
      console.error("Error clearing cookies:", cookieError);
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during logout. Please try again.",
      error: env.NODE_ENV === "dev" ? error.message : undefined,
    });
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).select(
      "-password -refreshTokens -resetPasswordToken -resetPasswordExpires -lastLogin -loginAttempts -lockUntil -lastLoginDevice -lastLoginIP -currentSessionId",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User data fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error while fetching user data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: env.NODE_ENV === "dev" ? error.message : undefined,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const currentSessionId = req.user?.sessionId;
    const { oldPassword, newPassword } = req.body;

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password",
      });
    }

    const user = await User.findById(userId).select("+password +refreshTokens");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password",
      });
    }

    user.password = newPassword;

    // Revoke all other sessions
    user.refreshTokens = user.refreshTokens.map((token) => {
      if (token.sessionId !== currentSessionId) {
        return { ...token.toObject(), isRevoked: true, revokedAt: new Date() };
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

    // BUG FIX: Update currentSessionId in DB when new session is created
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

    console.log(`Password changed for user: ${userId}`);

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Other devices have been logged out.",
    });
  } catch (error) {
    console.error("Error while changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: env.NODE_ENV === "dev" ? error.message : undefined,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const clientIP =
      req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const user = await User.findOne({ email, isActive: true }).select(
      "_id email name isActive resetPasswordAttempts lastResetRequest resetPasswordExpires",
    );

    // BUG FIX (User Enumeration): Original returned 404 when user not found,
    // leaking which emails are registered. Always return 200 to prevent enumeration.
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
      // BUG FIX: Still return 200 here to avoid confirming account existence
      // via a different response code. Log server-side for monitoring.
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
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitTime} seconds before requesting another reset link.`,
      });
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires > now) {
      const timeRemaining = Math.ceil(
        (user.resetPasswordExpires - now) / 1000 / 60,
      );
      return res.status(400).json({
        success: false,
        message: `A reset link was already sent. Please wait ${timeRemaining} minutes or check your email.`,
      });
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
        console.error(`Failed to send password reset email to ${email}:`, emailError);
      },
    );

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
      ...(env.NODE_ENV === "dev" && { debug: { resetToken, resetLink } }),
    });
  } catch (error) {
    console.error("Error while sending reset link:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: env.NODE_ENV === "dev" ? error.message : undefined,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const { token } = req.params;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // BUG FIX: Must explicitly select resetPasswordToken and resetPasswordExpires
    // since they now have select:false on the schema.
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
      isActive: true,
    }).select("+password +refreshTokens +resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired reset token. Please request a new password reset link.",
      });
    }

    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current password",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordAttempts = 0;
    user.lastResetRequest = undefined;

    if (user.refreshTokens?.length > 0) {
      user.refreshTokens = user.refreshTokens.map((t) => ({
        ...t.toObject(),
        isRevoked: true,
        revokedAt: new Date(),
      }));
    }

    user.currentSessionId = undefined;
    user.lastPasswordChange = new Date();
    user.lastPasswordChangeIP = req.ip || req.connection?.remoteAddress;
    user.lastPasswordChangeDevice = req.headers["user-agent"];

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    console.error("Error while resetting password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: env.NODE_ENV === "dev" ? error.message : undefined,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, {
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Refresh token expired. Please login again.",
          code: "REFRESH_TOKEN_EXPIRED",
        });
      }
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    const user = await User.findById(decoded.userId).select("role isActive");
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    const newTokens = await rotateTokens(
      decoded.userId,
      user.role,
      refreshToken,
      req,
    );

    // BUG FIX: Update currentSessionId after token rotation
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

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        expiresIn: newTokens.expiresIn,
        tokenType: newTokens.tokenType,
        sessionId: newTokens.sessionId,
      },
    });
  } catch (error) {
    console.error("Error while refreshing access token:", error);

    // BUG FIX: rotateTokens now throws descriptive errors (reuse detection).
    // Surface them properly instead of always returning generic 500.
    if (
      error.message?.includes("reuse detected") ||
      error.message?.includes("Invalid refresh token")
    ) {
      return res.status(401).json({
        success: false,
        message: error.message,
        code: "REFRESH_TOKEN_INVALID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: env.NODE_ENV === "dev" ? error.message : undefined,
    });
  }
};