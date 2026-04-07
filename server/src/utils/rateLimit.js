import rateLimit from "express-rate-limit";

// const keyGenerator = (req) => {
//   const ip = req.ip;
//   const userId = req.user?.userId;

//   if (userId) {
//     return `${userId}_${ip}`;
//   }

//   return ip; // guest user
// };

export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  // keyGenerator,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

// export const authLimiter = rateLimit({
//   windowMs: 5 * 60 * 1000,
//   max: 5,
//   keyGenerator: (req) => {
//     const ip = req.ip;
//     const identifier = req.body.identifier || "guest";

//     return `${identifier}_${ip}`;
//   },
//   message: "Too many login attempts, please try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });
