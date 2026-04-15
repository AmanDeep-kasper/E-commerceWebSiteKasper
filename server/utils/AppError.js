/**
 * Custom AppError class for consistent error handling
 * Implements proper error categorization and status codes
 */
class AppError extends Error {
  constructor(message, statusCode, code = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || `ERROR_${statusCode}`;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Mark as operational error

    Error.captureStackTrace(this, this.constructor);
  }

  // Create a validation error
  static validation(message, code = "VALIDATION_ERROR", details = null) {
    return new AppError(message, 400, code, details);
  }

  // Create an authentication error
  static authentication(
    message = "Authentication failed",
    code = "AUTH_ERROR",
  ) {
    return new AppError(message, 401, code);
  }

  // Create an authorization error
  static authorization(message = "Access forbidden", code = "FORBIDDEN") {
    return new AppError(message, 403, code);
  }

  // Create a not found error
  static notFound(message = "Resource not found", code = "NOT_FOUND") {
    return new AppError(message, 404, code);
  }

  // create a not allowed method
  static notAllowed(message = "Method not allowed", code = "NOT_ALLOWED") {
    return new AppError(message, 405, code);
  }

  // Create a conflict error
  static conflict(message, code = "CONFLICT") {
    return new AppError(message, 409, code);
  }

  // Create an internal server error
  static internal(message = "Internal server error", code = "INTERNAL_ERROR") {
    return new AppError(message, 500, code);
  }

  // Create a bad request error
  static badRequest(message, code = "BAD_REQUEST", details = null) {
    return new AppError(message, 400, code, details);
  }
}

export default AppError;
