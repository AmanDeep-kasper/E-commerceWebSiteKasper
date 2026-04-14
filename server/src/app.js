// import dotenv from "dotenv";
// dotenv.config();

import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import env from "./config/env.js";

// Routes
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import addressRouter from "./routes/addressRoutes.js";
import productRouter from "./routes/productRoutes.js";
import collectionRouter from "./routes/collectionRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import rewardRouter from "./routes/rewardRoutes.js";
import wishlistRouter from "./routes/wishlistRouter.js";

// Middlewares
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

// Rate limiting
import { globalLimiter, speedLimiter } from "./middlewares/rateLimit.js";

const app = express();

// Secure HTTP headers
app.use(helmet());
app.use(hpp());

// cors configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173", // 🔥 ADD THIS
  "http://localhost:5174",
  "https://e-commercewebsitekasper.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Origin:", origin); // debug

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // ❗ IMPORTANT CHANGE
    return callback(null, true); // allow instead of false
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, _res, next) => {
  console.log("Incoming Origin:", req.headers.origin);
  next();
});

// Rate limiting
if (env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(globalLimiter);
app.use(speedLimiter);

// json parser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// cookie parser
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server is running...",
  });
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/collection", collectionRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/reward", rewardRouter);
app.use("/api/v1/wishlist", wishlistRouter);

// 404 Not Found Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
