import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import env from "../config/env.js";
import User from "../models/User.js";
import Blacklist from "../models/blacklist.js";

export const generateAccessToken = (userId, role, sessionId, fingerprint) => {
  const tokenId = crypto.randomBytes(16).toString("hex");

  const payload = {
    userId,
    role,
    tokenId,
    sessionId: sessionId || crypto.randomBytes(16).toString("hex"),
    fingerprint: fingerprint || null,
  };

  const isRS256 = env.NODE_ENV !== "dev";

  return jwt.sign(payload, isRS256 ? env.PRIVATE_KEY : env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRATION || "15m",
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithm: isRS256 ? "RS256" : "HS256",
  });
};

export const generateRefreshToken = async (
  userId,
  sessionId,
  req,
  fingerprint,
) => {
  const refreshTokenId = crypto.randomBytes(32).toString("hex");

  const payload = {
    userId,
    sessionId,
    refreshTokenId,
    fingerprint: fingerprint || null,
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

  await storeRefreshToken(
    userId,
    refreshTokenId,
    sessionId,
    hashedToken,
    req,
    fingerprint,
  );

  return refreshToken;
};

export const generateAuthTokens = async (userId, role, req = null) => {
  const sessionId = crypto.randomBytes(32).toString("hex");
  const deviceFingerprint = req ? generateDeviceFingerprint(req) : null;

  const accessToken = generateAccessToken(
    userId,
    role,
    sessionId,
    deviceFingerprint,
  );
  const refreshToken = await generateRefreshToken(
    userId,
    sessionId,
    req,
    deviceFingerprint,
  );

  return {
    accessToken,
    refreshToken,
    sessionId,
    expiresIn: env.JWT_ACCESS_EXPIRATION || "15m",
    tokenType: "Bearer",
  };
};

export const generateDeviceFingerprint = (req) => {
  const fingerprint = {
    userAgent: req.headers["user-agent"],
    acceptLanguage: req.headers["accept-language"],
    acceptEncoding: req.headers["accept-encoding"],
    ipAddress: req.ip || req.connection?.remoteAddress,
    platform: req.headers["sec-ch-ua-platform"],
    // BUG FIX: Removed `timestamp: Date.now()` from fingerprint.
    // Including a timestamp made every fingerprint unique per-request,
    // so fingerprint verification ALWAYS failed — no request could ever
    // match a previously stored fingerprint. Removed entirely.
  };

  return crypto
    .createHash("sha256")
    .update(JSON.stringify(fingerprint))
    .digest("hex");
};

async function storeRefreshToken(
  userId,
  refreshTokenId,
  sessionId,
  refreshToken,
  req,
  fingerprint,
) {
  await User.updateOne(
    { _id: userId },
    {
      $push: {
        refreshTokens: {
          $each: [
            {
              tokenId: refreshTokenId,
              sessionId: sessionId,
              token: refreshToken,
              createdAt: new Date(),
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              isRevoked: false,
              deviceInfo: {
                userAgent: req?.headers["user-agent"],
                ipAddress: req?.ip || req?.connection?.remoteAddress,
                platform: req?.headers["sec-ch-ua-platform"],
                fingerprint: fingerprint || null,
              },
            },
          ],
          $slice: -5,
        },
      },
    },
  );
}

export const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, hashedToken };
};

export const verifyAccessToken = async (token, req = null) => {
  try {
    const isRS256 = env.NODE_ENV !== "dev";
    const decoded = jwt.verify(
      token,
      isRS256 ? env.PUBLIC_KEY : env.JWT_ACCESS_SECRET,
      {
        algorithms: isRS256 ? ["RS256"] : ["HS256"],
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      },
    );

    const isBlacklisted = await checkBlacklist(token);
    if (isBlacklisted) {
      throw new Error("Token has been revoked");
    }

    if (req && decoded.fingerprint) {
      const currentFingerprint = generateDeviceFingerprint(req);
      if (decoded.fingerprint !== currentFingerprint) {
        console.warn("Device fingerprint mismatch");
      }
    }

    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

export const blacklistToken = async (token) => {
  const decoded = jwt.decode(token);
  if (!decoded) return false;

  // BUG FIX: Original stored the raw token string in a `token` field that
  // doesn't exist in the Blacklist schema. The schema only has `tokenId`.
  // Fix: store only the tokenId (which IS in the schema and indexed).
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

    const blacklisted = await Blacklist.findOne({
      tokenId: decoded.tokenId,
    }).lean();
    return !!blacklisted;
  } catch (error) {
    return false;
  }
}

export const rotateTokens = async (userId, role, oldRefreshToken, req) => {
  // BUG FIX: Original caught the error from jwt.verify / DB checks and then
  // re-threw `new Error("Invalid refresh token")`, hiding the real cause
  // (e.g. "Refresh token reuse detected") from upstream callers.
  // Fix: preserve and re-throw the original error message.

  const decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithms: ["HS256"],
  });
  // ^ If this throws (expired, tampered), it propagates naturally to refreshAccessToken handler

  if (decoded.fingerprint) {
    const currentFingerprint = generateDeviceFingerprint(req);
    if (decoded.fingerprint !== currentFingerprint) {
      console.warn("Refresh token fingerprint mismatch");
    }
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(oldRefreshToken)
    .digest("hex");

  const tokenDoc = await User.findOne({
    _id: userId,
    "refreshTokens.token": hashedToken,
  });

  if (!tokenDoc) {
    throw new Error("Invalid refresh token");
  }

  const tokenData = tokenDoc.refreshTokens.find((t) => t.token === hashedToken);

  if (tokenData.isRevoked) {
    // Token reuse detected — revoke ALL sessions for this user
    await User.updateOne(
      { _id: userId },
      { $set: { "refreshTokens.$[].isRevoked": true } },
    );
    throw new Error("Refresh token reuse detected. All sessions revoked.");
  }

  await invalidateRefreshToken(userId, decoded.sessionId);

  const newTokens = await generateAuthTokens(userId, role, req);
  return newTokens;
};

async function invalidateRefreshToken(userId, sessionId) {
  await User.updateOne(
    { _id: userId, "refreshTokens.sessionId": sessionId },
    {
      $set: { "refreshTokens.$.isRevoked": true },
    },
  );
}
