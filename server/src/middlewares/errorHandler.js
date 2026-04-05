import env from "../config/env.js";
import AppError from "../utils/AppError.js";

const formatErrorResponse = (err, isDevelopment = false) => {
  const response = {
    success: false,
    message: err.message || "An error occurred",
    code: err.code || "INTERNAL_ERROR",
    timestamp: err.timestamp || new Date().toISOString(),
  };

  // Only include details in development or if explicitly provided
  if (isDevelopment && err.details) {
    response.details = err.details;
  }

  // Only include stack trace in development
  if (isDevelopment && err.stack && !err.isOperational) {
    response.stack = err.stack.split("\n");
  }

  return response;
};


// Handle specific error types
const handleError = (err, isDevelopment) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.code = err.code || "INTERNAL_ERROR";
  error.timestamp = new Date().toISOString();

  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    const details = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));

    error.message = "Validation failed";
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = isDevelopment ? details : undefined;
    error.isOperational = true;
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error.statusCode = 409;
    error.code = "DUPLICATE_FIELD";
    error.isOperational = true;
  }

  // Handle Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    error.message = "Invalid ID format";
    error.statusCode = 400;
    error.code = "INVALID_ID";
    error.isOperational = true;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.statusCode = 401;
    error.code = "INVALID_TOKEN";
    error.isOperational = true;
  }

  if (err.name === "TokenExpiredError") {
    error.message = "Token has expired";
    error.statusCode = 401;
    error.code = "TOKEN_EXPIRED";
    error.isOperational = true;
  }

  // Handle file upload errors (Multer)
  if (err.code === "LIMIT_FILE_SIZE") {
    error.message = "File size exceeds limit";
    error.statusCode = 413;
    error.code = "FILE_TOO_LARGE";
    error.isOperational = true;
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    error.message = "Too many files uploaded";
    error.statusCode = 400;
    error.code = "FILE_COUNT_EXCEEDED";
    error.isOperational = true;
  }

  if (err.code === "LIMIT_PART_COUNT") {
    error.message = "Too many form fields";
    error.statusCode = 400;
    error.code = "FORM_FIELDS_EXCEEDED";
    error.isOperational = true;
  }

  // Handle unsupported media type in Multer
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    error.message = "Unsupported file type";
    error.statusCode = 400;
    error.code = "UNSUPPORTED_FILE_TYPE";
    error.isOperational = true;
  }

  // Handle MongoDB server errors
  if (err.name === "MongoServerError" || err.name === "MongoNetworkError") {
    error.message = isDevelopment
      ? `Database error: ${err.message}`
      : "A database error occurred";
    error.statusCode = 500;
    error.code = isDevelopment ? "DATABASE_ERROR" : "INTERNAL_ERROR";
    error.isOperational = true;
  }

  // Handle syntax errors in JSON parsing
  if (err instanceof SyntaxError && "body" in err) {
    error.message = "Invalid JSON format";
    error.statusCode = 400;
    error.code = "INVALID_JSON";
    error.isOperational = true;
  }

  return error;
};

/**
 * Global error handler middleware
 * Must be defined last, after all other middleware and route handlers
 */
export const errorHandler = (err, req, res, next) => {
  const isDevelopment = env.NODE_ENV === "development" || env.NODE_ENV === "dev";

  // Handle the error
  let error = handleError(err, isDevelopment);

  // Ensure status code is set
  error.statusCode = error.statusCode || 500;

  // Format response based on environment
  const response = formatErrorResponse(error, isDevelopment);

  // Log error for debugging (in production too, but safely)
  if (isDevelopment) {
    console.error("❌ Error occurred:", {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      path: req.path,
      method: req.method,
      stack: err.stack,
    });
  } else {
    // In production, log only essential info (no stack traces or sensitive data)
    console.error("❌ Error occurred:", {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
      path: req.path,
      method: req.method,
      ip: req.ip,
      timestamp: error.timestamp,
    });
  }

  // Send response
  res.status(error.statusCode).json(response);
};

/**
 * 404 Not Found handler
 * Should be placed after all route definitions
 */
export const notFoundHandler = (req, res, next) => {
  const error = AppError.notFound(
    `Route ${req.method} ${req.path} not found`,
    "ROUTE_NOT_FOUND",
  );
  next(error);
};

export default errorHandler;
