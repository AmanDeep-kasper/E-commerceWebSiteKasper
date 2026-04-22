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

  return jwt.sign({ userId, role, tokenId, sessionId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRATION || "3m",
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

  const refreshToken = jwt.sign(
    { userId, sessionId, refreshTokenId },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRATION || "7d",
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    },
  );

  await storeRefreshToken(userId, refreshTokenId, sessionId, refreshToken, req);

  return refreshToken;
};

/* ================================
   GENERATE TOKENS (LOGIN ONLY)
================================ */
export const generateAuthTokens = async (userId, role, req = null) => {
  const sessionId = crypto.randomBytes(32).toString("hex");

  const accessToken = generateAccessToken(userId, role, sessionId);
  const refreshToken = await generateRefreshToken(userId, sessionId, req);

  return {
    accessToken,
    refreshToken,
    sessionId,
    expiresIn: env.JWT_ACCESS_EXPIRATION || "3m",
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
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const MAX_SESSIONS = 10;

  await User.updateOne(
    { _id: userId },
    {
      $push: {
        refreshTokens: {
          $each: [
            {
              tokenId: refreshTokenId,
              sessionId,
              token: hashedToken,
              createdAt: new Date(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              isRevoked: false,
              deviceInfo: {
                userAgent: req?.headers["user-agent"]?.slice(0, 200),
                ipAddress:
                  req?.headers["x-forwarded-for"]?.split(",")[0] ||
                  req?.ip ||
                  req?.connection?.remoteAddress,
              },
            },
          ],
          $slice: -MAX_SESSIONS,
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
   ROTATE TOKENS (FINAL FIXED)
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

  const user = await User.findById(userId).select("refreshTokens");
  if (!user) throw new Error("User not found");

  const tokenData = user.refreshTokens.find((t) => t.token === hashedToken);

  if (!tokenData) throw new Error("Invalid refresh token");

  // ✅ Expiry check
  if (tokenData.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  const currentIP =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.ip ||
    req.connection?.remoteAddress;

  /* ========================
     REUSE DETECTION
  ======================== */
  // if (tokenData.isRevoked) {
  //   const isSameDevice = tokenData.deviceInfo?.ipAddress === currentIP;

  //   // ✅ Allow ONLY within small time window (race condition fix)
  //   const isRecent = new Date() - new Date(tokenData.createdAt) < 5000; // 5 sec

  //   // ✅ Same device → allow but KEEP SAME SESSION
  //   if (isSameDevice && isRecent) {
  //     const accessToken = generateAccessToken(userId, role, decoded.sessionId);
  //     const refreshToken = await generateRefreshToken(
  //       userId,
  //       decoded.sessionId,
  //       req,
  //     );

  //     return {
  //       accessToken,
  //       refreshToken,
  //       sessionId: decoded.sessionId,
  //     };

  //     // Otherwise BLOCK
  //     throw new Error("Refresh token already used (possible replay attack)");
  //   }

  //   // suspicious → revoke all
  //   await User.updateOne(
  //     { _id: userId },
  //     {
  //       $set: {
  //         "refreshTokens.$[].isRevoked": true,
  //         activeSessions: [],
  //       },
  //     },
  //   );

  //   throw new Error("Security alert: All sessions revoked.");
  // }

  if (tokenData.isRevoked) {
    const currentIP =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.ip ||
      req.connection?.remoteAddress;

    const isSameDevice = tokenData.deviceInfo?.ipAddress === currentIP;

    const isRecent = new Date() - new Date(tokenData.createdAt) < 10000; // 10 sec

    // ✅ SAFE CASE → allow (frontend duplicate call)
    if (isSameDevice && isRecent) {
      return {
        accessToken: generateAccessToken(userId, role, decoded.sessionId),
        refreshToken: oldRefreshToken, // 🔥 IMPORTANT: don't rotate again
        sessionId: decoded.sessionId,
      };
    }

    // ⚠️ REAL ATTACK → revoke all
    await User.updateOne(
      { _id: userId },
      {
        // $set: {
        //   "refreshTokens.$[].isRevoked": true,
        //   activeSessions: [],
        // },

        $set: {
          "refreshTokens.$.isRevoked": true,
        },
      },
    );

    throw new Error("Session expired. Please login again.");
  }

  /* ========================
     NORMAL ROTATION
  ======================== */
  const result = await User.updateOne(
    { _id: userId, "refreshTokens.token": hashedToken },
    {
      $set: { "refreshTokens.$.isRevoked": true },
    },
  );

  if (result.modifiedCount === 0) {
    throw new Error("Failed to revoke token");
  }

  // ✅ IMPORTANT: reuse sessionId
  const accessToken = generateAccessToken(userId, role, decoded.sessionId);
  const refreshToken = await generateRefreshToken(
    userId,
    decoded.sessionId,
    req,
  );

  return {
    accessToken,
    refreshToken,
    sessionId: decoded.sessionId,
  };
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
