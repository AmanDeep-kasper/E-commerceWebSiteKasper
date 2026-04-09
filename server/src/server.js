import app from "./app.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import setupUnhandledErrorHandlers from "./utils/unhandledErrorHandler.js";

const startServer = async () => {
  try {
    setupUnhandledErrorHandlers();

    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
