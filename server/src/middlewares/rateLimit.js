import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis.js";

// ─── Global Limiter ───────────────────────────────────────────────
// Applied to all routes via app.use(). High limit for normal browsing.
// Skips auth-specific routes that have their own stricter limiters.
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests/minute per key

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    if (req.user?.userId) {
      return `global:user:${req.user.userId}`;
    }
    return `global:ip:${req.ip}`;
  },

  skip: (req) => {
    const path = req.path;
    // Skip routes that have their own dedicated limiters
    return (
      path.includes("/auth/login") ||
      path.includes("/auth/register") ||
      path.includes("/auth/forgot-password") ||
      path.includes("/auth/reset-password")
    );
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: "rl:global:",
  }),

  message: {
    success: false,
    message: "Too many requests, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});

// ─── Login Limiter ────────────────────────────────────────────────
// Strict: 5 failed attempts/minute per identifier (email/phone).
// Successful requests don't count against the limit.
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  keyGenerator: (req) => {
    const identifier = (req.body?.identifier || "").toLowerCase().trim();
    return `login:${identifier || req.ip}`;
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: "rl:login:",
  }),

  message: {
    success: false,
    message: "Too many login attempts. Try again in 1 minute.",
    code: "LOGIN_RATE_LIMIT",
  },
});

// ─── Sensitive Limiter ────────────────────────────────────────────
// For register, OTP, forgot password — 5 requests per 5 minutes.
export const sensitiveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return `sensitive:${req.ip}`;
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: "rl:sensitive:",
  }),

  message: {
    success: false,
    message: "Too many requests. Please try again in a few minutes.",
    code: "SENSITIVE_RATE_LIMIT",
  },
});

// ─── General Limiter ──────────────────────────────────────────────
// For authenticated endpoints like /me, /logout, /change-password.
// 30 requests/minute per user or IP.
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    if (req.user?.userId) {
      return `general:user:${req.user.userId}`;
    }
    return `general:ip:${req.ip}`;
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: "rl:general:",
  }),

  message: {
    success: false,
    message: "Too many requests, please slow down.",
    code: "GENERAL_RATE_LIMIT",
  },
});

// ─── Speed Limiter ────────────────────────────────────────────────
// Progressive slowdown: after 50 requests in 1 minute, each subsequent
// request is delayed by 500ms. Doesn't block — just slows.
export const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,

  keyGenerator: (req) => {
    return `speed:${req.ip}`;
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: "rl:speed:",
  }),
});
