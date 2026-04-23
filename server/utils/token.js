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

//  ROTATE TOKENS (FINAL FIXED)
// export const rotateTokens = async (userId, role, oldRefreshToken, req) => {
//   const decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET, {
//     issuer: env.JWT_ISSUER,
//     audience: env.JWT_AUDIENCE,
//   });

//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(oldRefreshToken)
//     .digest("hex");

//   const user = await User.findById(userId).select("refreshTokens");
//   if (!user) throw new Error("User not found");

//   const tokenData = user.refreshTokens.find((t) => t.token === hashedToken);

//   if (!tokenData) throw new Error("Invalid refresh token");

//   // ✅ Expiry check
//   if (tokenData.expiresAt < new Date()) {
//     throw new Error("Refresh token expired");
//   }

//   const currentIP =
//     req.headers["x-forwarded-for"]?.split(",")[0] ||
//     req.ip ||
//     req.connection?.remoteAddress;

//   /* ========================
//      REUSE DETECTION
//   ======================== */
//   // if (tokenData.isRevoked) {
//   //   const isSameDevice = tokenData.deviceInfo?.ipAddress === currentIP;

//   //   // ✅ Allow ONLY within small time window (race condition fix)
//   //   const isRecent = new Date() - new Date(tokenData.createdAt) < 5000; // 5 sec

//   //   // ✅ Same device → allow but KEEP SAME SESSION
//   //   if (isSameDevice && isRecent) {
//   //     const accessToken = generateAccessToken(userId, role, decoded.sessionId);
//   //     const refreshToken = await generateRefreshToken(
//   //       userId,
//   //       decoded.sessionId,
//   //       req,
//   //     );

//   //     return {
//   //       accessToken,
//   //       refreshToken,
//   //       sessionId: decoded.sessionId,
//   //     };

//   //     // Otherwise BLOCK
//   //     throw new Error("Refresh token already used (possible replay attack)");
//   //   }

//   //   // suspicious → revoke all
//   //   await User.updateOne(
//   //     { _id: userId },
//   //     {
//   //       $set: {
//   //         "refreshTokens.$[].isRevoked": true,
//   //         activeSessions: [],
//   //       },
//   //     },
//   //   );

//   //   throw new Error("Security alert: All sessions revoked.");
//   // }

//   if (tokenData.isRevoked) {
//     const currentIP =
//       req.headers["x-forwarded-for"]?.split(",")[0] ||
//       req.ip ||
//       req.connection?.remoteAddress;

//     const isSameDevice = tokenData.deviceInfo?.ipAddress === currentIP;

//     const isRecent = new Date() - new Date(tokenData.createdAt) < 10000; // 10 sec

//     // ✅ SAFE CASE → allow (frontend duplicate call)
//     if (isSameDevice && isRecent) {
//       return {
//         accessToken: generateAccessToken(userId, role, decoded.sessionId),
//         refreshToken: oldRefreshToken, // 🔥 IMPORTANT: don't rotate again
//         sessionId: decoded.sessionId,
//       };
//     }

//     // ⚠️ REAL ATTACK → revoke all
//     await User.updateOne(
//       { _id: userId },
//       {
//         // $set: {
//         //   "refreshTokens.$[].isRevoked": true,
//         //   activeSessions: [],
//         // },

//         $set: {
//           "refreshTokens.$.isRevoked": true,
//         },
//       },
//     );

//     throw new Error("Session expired. Please login again.");
//   }

//   /* ========================
//      NORMAL ROTATION
//   ======================== */
//   const result = await User.updateOne(
//     { _id: userId, "refreshTokens.token": hashedToken },
//     {
//       $set: { "refreshTokens.$.isRevoked": true },
//     },
//   );

//   if (result.modifiedCount === 0) {
//     throw new Error("Failed to revoke token");
//   }

//   // ✅ IMPORTANT: reuse sessionId
//   const accessToken = generateAccessToken(userId, role, decoded.sessionId);
//   const refreshToken = await generateRefreshToken(
//     userId,
//     decoded.sessionId,
//     req,
//   );

//   return {
//     accessToken,
//     refreshToken,
//     sessionId: decoded.sessionId,
//   };
// };

export const rotateTokens = async (userId, role, oldRefreshToken, req) => {
  // 1. Verify JWT signature first (cheap, no DB)
  const decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  const hashedToken = crypto
    .createHash("sha256")
    .update(oldRefreshToken)
    .digest("hex");

  // 2. ATOMIC: mark as revoked only if NOT already revoked
  //    This is the key fix — single findOneAndUpdate instead of read+write
  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      "refreshTokens.token": hashedToken,
      "refreshTokens.isRevoked": false,   // only match if still valid
    },
    {
      $set: {
        "refreshTokens.$.isRevoked": true,
        "refreshTokens.$.revokedAt": new Date(),
      },
    },
    {
      new: false, // return the ORIGINAL doc (before update)
      select: "refreshTokens role",
    }
  );

  // 3. If atomic update found nothing, token was already rotated
  if (!user) {
    // Could be: (a) concurrent rotation already happened, or (b) real attack
    // Distinguish by checking if a recently-created successor token exists
    const currentUser = await User.findById(userId).select("refreshTokens");
    if (!currentUser) throw new Error("User not found");

    const revokedToken = currentUser.refreshTokens.find(
      (t) => t.token === hashedToken
    );

    if (!revokedToken) {
      throw new Error("Refresh token not found");
    }

    if (revokedToken.expiresAt < new Date()) {
      throw new Error("Refresh token expired");
    }

    // Check if this was very recently rotated (concurrent request race)
    const rotatedAt = revokedToken.revokedAt;
    const isRecentRotation =
      rotatedAt && new Date() - new Date(rotatedAt) < 30_000; // 30s grace

    if (isRecentRotation) {
      // Find the successor token for this session (same sessionId, newer)
      const successorToken = currentUser.refreshTokens
        .filter(
          (t) =>
            t.sessionId === decoded.sessionId &&
            t.token !== hashedToken &&
            !t.isRevoked &&
            t.createdAt > revokedToken.createdAt
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      if (successorToken) {
        // Race condition: concurrent rotation won, reuse its access token
        // Don't issue a new refresh token — the winner already did
        const accessToken = generateAccessToken(
          userId,
          role,
          decoded.sessionId
        );
        return {
          accessToken,
          // Return the OLD refresh token — the client already has the new one
          // from the winning request. This losing request just needs an access token.
          refreshToken: oldRefreshToken,
          sessionId: decoded.sessionId,
          _concurrentRotation: true, // optional debug flag
        };
      }
    }

    // If we get here: revoked but no recent rotation + no successor = attack
    // Revoke ALL tokens for this user
    await User.updateOne(
      { _id: userId },
      { $set: { "refreshTokens.$[].isRevoked": true, activeSessions: [] } }
    );
    throw new Error("Security alert: session revoked. Please login again.");
  }

  // 4. Normal path: atomic update succeeded, we own the rotation
  const tokenData = user.refreshTokens.find((t) => t.token === hashedToken);

  // Expiry check on the original token data
  if (tokenData && tokenData.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  // Issue new tokens with the same sessionId
  const accessToken = generateAccessToken(userId, role, decoded.sessionId);
  const refreshToken = await generateRefreshToken(
    userId,
    decoded.sessionId,
    req
  );

  return {
    accessToken,
    refreshToken,
    sessionId: decoded.sessionId,
  };
};

//  BLACKLIST
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
