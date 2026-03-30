import dotenv from "dotenv";
dotenv.config();

import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
// import Stripe from "stripe";

// Import route files
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

connectDB();

const app = express()
app.use(cookieParser());

// Middleware must be at top
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://lasercut.kasperinfotech.org",
  "https://e-commerbackend-5.onrender.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// app.post("/create-payment-intent", async (req, res) => {
//   try {
//     let { amount } = req.body;

//     if (!amount || amount <= 0) {
//       return res.status(400).json({ error: "Invalid payment amount" });
//     }

//     // Stripe accepts only integer amount in paise
//     // const stripeAmount = Math.round(amount * 100);

//     // if (stripeAmount < 100) {
//     //   return res.status(400).json({ error: "Amount must be at least ₹1.00" });
//     // }

//     // const paymentIntent = await stripe.paymentIntents.create({
//     //   amount: stripeAmount,
//     //   currency: "inr",
//     // });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (err) {
//     console.error("Stripe Error:", err);
//     res.status(500).json({ error: "Stripe error occurred" });
//   }
// });

// Static uploads directory
app.use("/uploads", express.static("uploads"));

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/categories", categoryRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);
