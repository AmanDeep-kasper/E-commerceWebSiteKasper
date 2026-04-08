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
    const ip = ipKeyGenerator(req);
    const ua = req.headers["user-agent"] || "unknown";

    return `${ip}:${ua}`;
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),

  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  keyGenerator: (req) => {
    const identifier = (req.body?.identifier || "").toLowerCase().trim();

    if (identifier) {
      return `auth:${identifier}`;
    }

    return ipKeyGenerator(req);
  },

  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),

  message: {
    success: false,
    message: "Too many login attempts, please try again later",
  },
});

export const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,
});
