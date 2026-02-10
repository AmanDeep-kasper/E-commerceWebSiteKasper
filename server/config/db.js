import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;



//////////////
// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000,
//     });
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ MongoDB connect error:", err.message);
//     // keep server alive (don’t crash)
//     // OR if you want hard fail, use: process.exit(1)
//   }
// };

// connectDB();

// mongoose.connection.on("error", (e) => console.error("Mongo runtime error:", e.message));
// mongoose.connection.on("disconnected", () => console.warn("Mongo disconnected"));

// export default connectDB;