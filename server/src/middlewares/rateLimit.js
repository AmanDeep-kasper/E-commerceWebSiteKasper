import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import slowDown from "express-slow-down";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis.js";

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    if (req.user?.id) {
      return `user:${req.user?.userId}`; // logged-in users
    }

    return `ip:${ipKeyGenerator(req)}`; // guests
  },

  skip: (req) => {
    const path = req.path;

    // skip critical auth routes
    return (
      path.includes("/auth/login") ||
      path.includes("/auth/register") ||
      path.includes("/auth/refresh-token") ||
      path.includes("/auth/me")
    );
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),

  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

// Strict limiter for login
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  keyGenerator: (req) => {
    const identifier = (req.body?.identifier || "").toLowerCase().trim();
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),

  message: {
    success: false,
    message: "Too many login attempts. Try again in 1 minute.",
  },
});

// Medium limiter (register / forgot password)
export const sensitiveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});

export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});

export const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
});
