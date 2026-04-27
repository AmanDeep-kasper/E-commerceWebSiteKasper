import mongoose from "mongoose";
import env from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
