import env from "../config/env.js";

/**
 * Set up handlers for unhandled promise rejections and exceptions
 * These should be called at server startup
 */
export const setupUnhandledErrorHandlers = () => {
  /**
   * Handle unhandled promise rejections
   */
  process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Promise Rejection:", {
      reason:
        reason instanceof Error ? reason.message : String(reason).slice(0, 100),
      code: reason?.code || "UNKNOWN",
      timestamp: new Date().toISOString(),
    });

    // In production, you might want to send alerts or log to external service
    if (env.NODE_ENV === "production") {
      // Example: Send to monitoring service
      // sendToMonitoring('unhandledRejection', { reason, promise });
    }
  });

  /**
   * Handle uncaught exceptions
   */
  process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", {
      message: error.message,
      code: error.code || "UNKNOWN",
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Uncaught exceptions are fatal - the process should exit
    // But we log it first for debugging
    if (env.NODE_ENV === "production") {
      // Example: Send critical alert
      // sendCriticalAlert('uncaughtException', { error });

      // Gracefully exit the process
      process.exit(1);
    }
  });

  /**
   * Handle warnings
   */
  process.on("warning", (warning) => {
    if (env.NODE_ENV === "development") {
      console.warn("⚠️  Process Warning:", {
        name: warning.name,
        message: warning.message,
        code: warning.code,
      });
    }
  });
};

export default setupUnhandledErrorHandlers;
