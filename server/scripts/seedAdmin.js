import mongoose from "mongoose";
import User from "..//models/User.js"
import env from "../config/env.js";

const seedAdmin = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(env.MONGO_URI);

    // 2️⃣ Get admin credentials from env
    const adminEmail = env.ADMIN_EMAIL;
    const adminPassword = env.ADMIN_PASSWORD;
    const adminName = env.ADMIN_NAME;

    // 3️⃣ Check if admin already exists
    const existingAdmin = await User.findOne({
      email: adminEmail,
      role: "admin",
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists in database!");
      process.exit(0);
    }

    const newAdmin = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      isVerified: true,
      isActive: true,
    });

    await newAdmin.save();

    const adminObject = {
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      isVerified: newAdmin.isVerified,
      isActive: newAdmin.isActive,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt,
    };

    console.log("✅ Admin created successfully!");
    console.log(adminObject);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    if (error.code === 11000) {
      console.error("   → Email already exists in database");
    }
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
  }
};

// Run the seed
seedAdmin();
