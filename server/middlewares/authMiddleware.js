import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";
import Blacklist from "../models/blacklist.js";

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
        algorithms: ["HS256"],
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      });
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please refresh your token.",
          code: "TOKEN_EXPIRED",
        });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token format.",
          code: "INVALID_TOKEN",
        });
      }
      throw jwtError;
    }

    const isBlacklisted = await Blacklist.findOne({
      tokenId: decoded.tokenId,
    }).lean();

    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Token has been revoked. Please login again.",
      });
    }

    const user = await User.findById(decoded.userId).select(
      "_id name email role isActive isVerified +activeSessions lastLogin",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    if (!user.isVerified && !isPublicRoute(req)) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email first.",
      });
    }

    // Multi-device session validation: check if session exists in activeSessions array
    if (
      user.activeSessions &&
      user.activeSessions.length > 0 &&
      !user.activeSessions.includes(decoded.sessionId)
    ) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
        code: "SESSION_EXPIRED",
      });
    }

    if (env.ENABLE_DEVICE_FINGERPRINT && decoded.fingerprint) {
      const { generateDeviceFingerprint } = await import("../utils/token.js");
      const currentFingerprint = generateDeviceFingerprint(req);
      if (decoded.fingerprint !== currentFingerprint) {
        console.warn("Device fingerprint mismatch detected");
        // Optionally: return 401 here for strict mode
        return res.status(401).json({
          success: false,
          message: "Device fingerprint mismatch. Please login again.",
        });
      }
    }

    req.user = {
      id: user._id,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      sessionId: decoded.sessionId,
      tokenId: decoded.tokenId,
      isVerified: user.isVerified,
      isActive: user.isActive,
    };

    req.token = token;
    req.tokenDecoded = decoded;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required before role check",
      });
    }

    const userRole = req.user.role?.toLowerCase();

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You are not authorized to access this resource.`,
      });
    }

    next();
  };
};

function isPublicRoute(req) {
  const publicPaths = [
    "/api/v1/auth/verify",
    "/api/v1/auth/resend-verification",
    "/api/v1/auth/forgot-password",
    "/api/v1/auth/reset-password",
  ];

  return publicPaths.some((path) => req.path.startsWith(path));
}
