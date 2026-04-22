// import Redis from "ioredis";
// import env from "./env.js";

// export const redis = new Redis(env.REDIS_URL, {
//   maxRetriesPerRequest: 3,
//   enableReadyCheck: true,
//   lazyConnect: true,

//   tls: {},
// });

// redis.on("connect", () => {
//   console.log("✅ Redis connected");
// });

// redis.on("error", (err) => {
//   console.error("❌ Redis error:", err.message);
// });

// redis.on("reconnecting", () => {
//   console.warn("🔄 Redis reconnecting...");
// });
