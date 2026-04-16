import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import env from "../config/env.js";
import User from "../models/User.js";
import Blacklist from "../models/blacklist.js";

/* ================================
   ACCESS TOKEN
================================ */
export const generateAccessToken = (userId, role, sessionId) => {
  const tokenId = crypto.randomBytes(16).toString("hex");

  const payload = {
    userId,
    role,
    tokenId,
    sessionId,
  };

  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRATION || "15m",
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithm: "HS256",
  });
};

/* ================================
   REFRESH TOKEN
================================ */
export const generateRefreshToken = async (userId, sessionId, req) => {
  const refreshTokenId = crypto.randomBytes(32).toString("hex");

  const payload = {
    userId,
    sessionId,
    refreshTokenId,
  };

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRATION || "7d",
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await storeRefreshToken(userId, refreshTokenId, sessionId, hashedToken, req);

  return refreshToken;
};

/* ================================
   GENERATE TOKENS
================================ */
export const generateAuthTokens = async (userId, role, req = null) => {
  const sessionId = crypto.randomBytes(32).toString("hex");

  const accessToken = generateAccessToken(userId, role, sessionId);
  const refreshToken = await generateRefreshToken(userId, sessionId, req);

  return {
    accessToken,
    refreshToken,
    sessionId,
    expiresIn: env.JWT_ACCESS_EXPIRATION || "15m",
    tokenType: "Bearer",
  };
};

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, hashedToken };
};

/* ================================
   STORE REFRESH TOKEN
================================ */
async function storeRefreshToken(
  userId,
  refreshTokenId,
  sessionId,
  refreshToken,
  req,
) {
  await User.updateOne(
    { _id: userId },
    {
      $push: {
        refreshTokens: {
          $each: [
            {
              tokenId: refreshTokenId,
              sessionId,
              token: refreshToken,
              createdAt: new Date(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              isRevoked: false,
              deviceInfo: {
                userAgent: req?.headers["user-agent"],
                ipAddress:
                  req?.headers["x-forwarded-for"]?.split(",")[0] ||
                  req?.ip ||
                  req?.connection?.remoteAddress,
              },
            },
          ],
          $slice: -5,
        },
      },
    },
  );
}

/* ================================
   VERIFY ACCESS TOKEN
================================ */
export const verifyAccessToken = async (token) => {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ["HS256"],
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    });

    const isBlacklisted = await checkBlacklist(token);
    if (isBlacklisted) throw new Error("Token revoked");

    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/* ================================
   ROTATE TOKENS (MAIN LOGIC)
================================ */
export const rotateTokens = async (userId, role, oldRefreshToken, req) => {
  const decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  const hashedToken = crypto
    .createHash("sha256")
    .update(oldRefreshToken)
    .digest("hex");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const tokenData = user.refreshTokens.find((t) => t.token === hashedToken);

  if (!tokenData) throw new Error("Invalid refresh token");

  const currentIP =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.ip ||
    req.connection?.remoteAddress;

  /* ========================
     REUSE DETECTION
  ======================== */
  if (tokenData.isRevoked) {
    console.warn("⚠️ Token reuse detected");

    const isSameIP = tokenData.deviceInfo?.ipAddress === currentIP;

    // ✅ SAME DEVICE → allow silently (NO logout)
    if (isSameIP) {
      return await generateAuthTokens(userId, role, req);
    }

    // 🔴 SUSPICIOUS → revoke all
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          "refreshTokens.$[].isRevoked": true,
          activeSessions: [],
        },
      },
    );

    throw new Error("Security alert: All sessions revoked.");
  }

  /* ========================
     NORMAL ROTATION
  ======================== */
  await User.updateOne(
    { _id: userId, "refreshTokens.sessionId": decoded.sessionId },
    {
      $set: { "refreshTokens.$.isRevoked": true },
    },
  );

  return await generateAuthTokens(userId, role, req);
};

/* ================================
   BLACKLIST
================================ */
export const blacklistToken = async (token) => {
  const decoded = jwt.decode(token);
  if (!decoded) return false;

  await Blacklist.create({
    tokenId: decoded.tokenId,
    expiresAt: new Date(decoded.exp * 1000),
    userId: decoded.userId,
  });

  return true;
};

async function checkBlacklist(token) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return false;

    const exists = await Blacklist.findOne({
      tokenId: decoded.tokenId,
    });

    return !!exists;
  } catch {
    return false;
  }
}
