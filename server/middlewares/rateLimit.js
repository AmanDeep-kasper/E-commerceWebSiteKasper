// import rateLimit, { ipKeyGenerator } from "express-rate-limit";
// import slowDown from "express-slow-down";
// import RedisStore from "rate-limit-redis";
// import { redis } from "../config/redis.js";

// // Helper (clean reusable)
// const getIP = (req) => ipKeyGenerator(req);

// // Global Limiter
// export const globalLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: 100,

//   standardHeaders: true,
//   legacyHeaders: false,

//   keyGenerator: (req) => {
//     if (req.user?.userId) {
//       return `global:user:${req.user.userId}`;
//     }
//     return `global:ip:${getIP(req)}`;
//   },

//   skip: (req) => {
//     const path = req.path;
//     return (
//       path.includes("/auth/login") ||
//       path.includes("/auth/register") ||
//       path.includes("/auth/forgot-password") ||
//       path.includes("/auth/reset-password")
//     );
//   },

//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args),
//     prefix: "rl:global:",
//   }),

//   message: {
//     success: false,
//     message: "Too many requests, please try again later.",
//     code: "RATE_LIMIT_EXCEEDED",
//   },
// });

// // Login Limiter
// export const loginLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 5,
//   standardHeaders: true,
//   legacyHeaders: false,
//   skipSuccessfulRequests: true,

//   keyGenerator: (req) => {
//     const identifier = (req.body?.identifier || "").toLowerCase().trim();

//     // fallback to IP safely
//     return `login:${identifier || getIP(req)}`;
//   },

//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args),
//     prefix: "rl:login:",
//   }),

//   message: {
//     success: false,
//     message: "Too many login attempts. Try again in 1 minute.",
//     code: "LOGIN_RATE_LIMIT",
//   },
// });

// // Sensitive Limiter
// export const sensitiveLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000,
//   max: 5,
//   standardHeaders: true,
//   legacyHeaders: false,

//   keyGenerator: (req) => {
//     return `sensitive:${getIP(req)}`;
//   },

//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args),
//     prefix: "rl:sensitive:",
//   }),

//   message: {
//     success: false,
//     message: "Too many requests. Please try again in a few minutes.",
//     code: "SENSITIVE_RATE_LIMIT",
//   },
// });

// // General Limiter
// export const generalLimiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 30,
//   standardHeaders: true,
//   legacyHeaders: false,

//   keyGenerator: (req) => {
//     if (req.user?.userId) {
//       return `general:user:${req.user.userId}`;
//     }
//     return `general:ip:${getIP(req)}`;
//   },

//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args),
//     prefix: "rl:general:",
//   }),

//   message: {
//     success: false,
//     message: "Too many requests, please slow down.",
//     code: "GENERAL_RATE_LIMIT",
//   },
// });

// // Speed Limiter
// export const speedLimiter = slowDown({
//   windowMs: 60 * 1000,
//   delayAfter: 50,
//   delayMs: () => 500,

//   keyGenerator: (req) => {
//     return `speed:${getIP(req)}`;
//   },

//   store: new RedisStore({
//     sendCommand: (...args) => redis.call(...args),
//     prefix: "rl:speed:",
//   }),
// });
