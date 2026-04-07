import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { ipKeyGenerator } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req); // 🔥 FIX
    const ua = req.headers["user-agent"] || "unknown";

    return `${ip}:${ua}`;
  },

  message: {
    success: false,
    message: "Too many requests",
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  keyGenerator: (req) => {
    const identifier = (req.body?.identifier || "").toLowerCase().trim();

    if (identifier) {
      return `auth:${identifier}`;
    }

    return ipKeyGenerator(req); // 🔥 FIX
  },

  message: {
    success: false,
    message: "Too many login attempts",
  },
});

export const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,
});
