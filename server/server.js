// ================== CORE IMPORTS ==================
import dns from "node:dns";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";

// ================== CONFIG ==================
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import setupUnhandledErrorHandlers from "./utils/unhandledErrorHandler.js";

// ================== ROUTES ==================
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import productRouter from "./routes/productRoutes.js";
import collectionRouter from "./routes/collectionRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import rewardRouter from "./routes/rewardRoutes.js";
import wishlistRouter from "./routes/wishlistRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import businessRouter from "./routes/admin/businessRoutes.js";

// ================== MIDDLEWARES ==================
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { globalLimiter, speedLimiter } from "./middlewares/rateLimit.js";

// ================== INIT ==================
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);

const app = express();

// Fix __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================== SECURITY ==================
app.use(helmet());
app.use(hpp());

// ================== CORS ==================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://localhost:5000",
  "https://e-commercewebsitekasper.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// ================== RATE LIMIT ==================
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(globalLimiter);
app.use(speedLimiter);

// ================== BODY ==================
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ================== COOKIES ==================
app.use(cookieParser());

/* ======================================================
   ✅ STATIC FILES (FIX FOR IMAGE ISSUE)
====================================================== */

// 🔥 Absolute path (IMPORTANT FIX)
const publicPath = path.join(__dirname, "public");

// Debug (you can remove later)
console.log("📂 Public folder path:", publicPath);

// Serve images like: http://localhost:5000/public/image.jpg
app.use("/public", express.static(publicPath));

/* ======================================================
   HEALTH CHECK
====================================================== */
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "🚀 Server running" });
});

/* ======================================================
   API ROUTES
====================================================== */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/collection", collectionRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/reward", rewardRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/dashboard/business", businessRouter);

/* ======================================================
   FRONTEND (SPA)
====================================================== */

const buildPath = path.join(__dirname, "../client/dist");

// Serve frontend build
app.use(express.static(buildPath));

// favicon fix
app.get("/favicon.ico", (_req, res) => res.status(204).end());

// ✅ SPA fallback (DO NOT TOUCH)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

/* ======================================================
   ERROR HANDLING
====================================================== */
app.use(notFoundHandler);
app.use(errorHandler);

/* ======================================================
   START SERVER
====================================================== */
const startServer = async () => {
  try {
    setupUnhandledErrorHandlers();
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`🌐 Public URL: http://localhost:${env.PORT}/public`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();