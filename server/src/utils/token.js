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

  const isRS256 = env.NODE_ENV !== "development";

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
  const fingerprint = req.headers["user-agent"] || "unknown";
  // const fingerprint = {
  //   // userAgent: req.headers["user-agent"],
  //   // acceptLanguage: req.headers["accept-language"],
  //   // platform: req.headers["sec-ch-ua-platform"],
  // };

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
    const isRS256 = env.NODE_ENV !== "development";
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

    // if (req && decoded.fingerprint) {
    //   const currentFingerprint = generateDeviceFingerprint(req);
    //   if (decoded.fingerprint !== currentFingerprint) {
    //     console.warn("Device fingerprint mismatch");
    //     throw new Error("Device fingerprint mismatch");
    //   }
    // }

    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

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

    const blacklisted = await Blacklist.findOne({
      tokenId: decoded.tokenId,
    }).lean();
    return !!blacklisted;
  } catch (error) {
    return false;
  }
}

// export const rotateTokens = async (userId, role, oldRefreshToken, req) => {
//   const decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET, {
//     issuer: env.JWT_ISSUER,
//     audience: env.JWT_AUDIENCE,
//     algorithms: ["HS256"],
//   });

//   if (decoded.fingerprint) {
//     const currentFingerprint = generateDeviceFingerprint(req);
//     if (decoded.fingerprint !== currentFingerprint) {
//       console.warn("Refresh token fingerprint mismatch");
//       throw new Error("Refresh token fingerprint mismatch");
//     }
//   }

//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(oldRefreshToken)
//     .digest("hex");

//   const tokenDoc = await User.findOne({
//     _id: userId,
//     "refreshTokens.token": hashedToken,
//   });

//   if (!tokenDoc) {
//     throw new Error("Invalid refresh token");
//   }

//   const tokenData = tokenDoc.refreshTokens.find((t) => t.token === hashedToken);

//   if (tokenData.isRevoked) {
//     // Token reuse detected — revoke ALL sessions for this user
//     await User.updateOne(
//       { _id: userId },
//       { $set: { "refreshTokens.$[].isRevoked": true } },
//     );
//     throw new Error("Refresh token reuse detected. All sessions revoked.");
//   }

//   await invalidateRefreshToken(userId, decoded.sessionId);

//   const newTokens = await generateAuthTokens(userId, role, req);
//   return newTokens;
// };
export const rotateTokens = async (userId, role, oldRefreshToken, req) => {
  const decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    algorithms: ["HS256"],
  });

  const getIP = (req) =>
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.ip ||
    req.connection?.remoteAddress;

  const currentIP = getIP(req);
  const currentFingerprint = generateDeviceFingerprint(req);

  // 🔐 Fingerprint check — only revoke THIS session on mismatch (not all sessions)
  // Multi-device means different devices will always have different fingerprints
  if (decoded.fingerprint && decoded.fingerprint !== currentFingerprint) {
    console.warn(
      "🚨 Refresh token fingerprint mismatch for session:",
      decoded.sessionId,
    );

    // Revoke only THIS session (not all sessions — that would break multi-device)
    await User.updateOne(
      { _id: userId, "refreshTokens.sessionId": decoded.sessionId },
      { $set: { "refreshTokens.$.isRevoked": true } },
    );

    // Remove this session from activeSessions
    await User.updateOne(
      { _id: userId },
      { $pull: { activeSessions: decoded.sessionId } },
    );

    throw new Error("Security alert: Device mismatch. Please login again.");
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

  if (!tokenData) {
    throw new Error("Invalid refresh token");
  }

  // 🔥 TOKEN REUSE LOGIC
  if (tokenData.isRevoked) {
    console.warn("⚠️ Token reuse detected");

    const storedFingerprint = tokenData.deviceInfo?.fingerprint;
    const storedIP = tokenData.deviceInfo?.ipAddress;

    const isSameDevice =
      storedFingerprint && storedFingerprint === currentFingerprint;

    const isSameIP = storedIP === currentIP;

    // 🟢 CASE 1: Same device (race condition / multi-tab)
    if (isSameDevice && isSameIP) {
      console.warn("🟢 Same device reuse → revoke only this session");

      await User.updateOne(
        { _id: userId, "refreshTokens.sessionId": tokenData.sessionId },
        { $set: { "refreshTokens.$.isRevoked": true } },
      );

      // Remove this session from activeSessions
      await User.updateOne(
        { _id: userId },
        { $pull: { activeSessions: tokenData.sessionId } },
      );

      console.warn("🟢 Same device reuse → allow rotation");

      const newTokens = await generateAuthTokens(userId, role, req);
      return newTokens;
    }

    // 🔴 CASE 2: Suspicious reuse (possible token theft)
    console.warn("🔴 Suspicious reuse → revoke ALL sessions");

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

  // ✅ Normal rotation
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
