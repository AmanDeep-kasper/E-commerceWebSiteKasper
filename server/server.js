// ================== CORE IMPORTS ==================
import dns from "node:dns";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";

// ================== CONFIG ==================
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import setupUnhandledErrorHandlers from "./utils/unhandledErrorHandler.js";

// cron jobs
import "./cron/scheduler.js";

// ================== ROUTES ==================
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import productRouter from "./routes/productRoutes.js";
import collectionRouter from "./routes/collectionRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import wishlistRouter from "./routes/wishlistRouter.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes.js";

// =========== admin dashboard setting routes ==============
import businessRouter from "./routes/admin/businessRoutes.js";
import warehouseRouter from "./routes/admin/warehouseRoutes.js";
import policyRouter from "./routes/admin/policyRoutes.js";
import shippingRouter from "./routes/admin/shippingRoutes.js";
import bannerRouter from "./routes/admin/bannerRoutes.js";
import transportRouter from "./routes/admin/transportRoutes.js";
import rewardRouter from "./routes/admin/rewardRoutes.js";
import PremiumRoutes from "./routes/admin/PremiumRoutes.js"

// ================== MIDDLEWARES ==================
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
// import { globalLimiter, speedLimiter } from "./middlewares/rateLimit.js";

// ================== INIT ==================
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);

const app = express();

// ================== SECURITY ==================
app.use(helmet());
app.use(hpp());

// ================== CORS ==================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "https://e-commercewebsitekasper.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 Origin:", origin);

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all (you can tighten in production)
      return callback(null, true);
    },
    credentials: true,
  }),
);

// Debug Middleware
app.use((req, _res, next) => {
  console.log("➡️ Incoming Origin:", req.headers.origin);
  next();
});

// ================== RATE LIMIT ==================
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
// app.use(globalLimiter);
// app.use(speedLimiter);

// ================== BODY PARSING ==================
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// ================== COOKIES & STATIC ==================
app.use(cookieParser());
app.use(express.static("public"));

// ================== HEALTH CHECK ==================
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server is running...",
  });
});

// ================== API ROUTES ==================
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/collection", collectionRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use('/api/v1/settings', PremiumRoutes);

// ============= Dashboard Setting Routes =============
app.use("/api/v1/dashboard/business", businessRouter);
app.use("/api/v1/dashboard/warehouse", warehouseRouter);
app.use("/api/v1/dashboard/policy", policyRouter);
app.use("/api/v1/dashboard/shipping", shippingRouter);
app.use("/api/v1/dashboard/banner", bannerRouter);
app.use("/api/v1/dashboard/transport", transportRouter);
app.use("/api/v1/dashboard/reward", rewardRouter);

// ================== ERROR HANDLING ==================
app.use(notFoundHandler);
app.use(errorHandler);

// ================== SERVER START ==================
const startServer = async () => {
  try {
    setupUnhandledErrorHandlers();

    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
