# Global Error Handler Middleware - Usage Guide

## Overview

A comprehensive, security-first error handling system has been implemented for the e-commerce server. This system handles all types of errors gracefully while ensuring sensitive information is never exposed to clients.

## File Structure

```
src/
├── middlewares/
│   └── errorHandler.js          # Global error handler middleware
├── utils/
│   ├── AppError.js              # Custom error class
│   ├── asyncHandler.js          # Async error wrapper
│   └── unhandledErrorHandler.js # Unhandled error handlers
└── app.js                        # Updated with error handlers
```

## Features

### 🔒 Security-First Design

- **No Stack Traces in Production**: Stack traces are only shown in development
- **Sanitized Error Messages**: Generic errors in production, detailed errors in development
- **No Sensitive Data Exposure**: Database URLs, API keys, internal paths never leak
- **Consistent Error Format**: All errors follow the same response structure
- **Logging Best Practices**: Production logs contain only essential info

### ✨ Error Handling Features

- Mongoose validation errors
- Duplicate key errors (unique constraints)
- Cast errors (invalid ObjectId)
- JWT authentication errors
- File upload errors (Multer)
- Database connection errors
- JSON parsing errors
- Custom application errors
- Unhandled promise rejections
- Uncaught exceptions
- 404 Not Found routes

## Usage Examples

### 1. Throwing Validation Errors

```javascript
import AppError from "../utils/AppError.js";

// Validation error
throw AppError.validation("Email is required", "EMAIL_REQUIRED");

// With details (only shown in development)
throw AppError.validation(
  "Validation failed",
  "VALIDATION_ERROR",
  {
    email: "Email is required",
    password: "Password must be at least 8 characters"
  }
);
```

### 2. Throwing Authentication/Authorization Errors

```javascript
// Authentication error
throw AppError.authentication("Invalid credentials", "INVALID_CREDENTIALS");

// Authorization error
throw AppError.authorization("You don't have permission", "INSUFFICIENT_PERMISSION");

// Not found error
throw AppError.notFound("User not found", "USER_NOT_FOUND");
```

### 3. Using Async Handler in Controllers

```javascript
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Or use alternative naming
export const updateUser = catchAsync(async (req, res, next) => {
  // Your code here
});
```

### 4. Throwing Custom Errors

```javascript
// Bad request
throw AppError.badRequest(
  "Invalid phone number format",
  "INVALID_PHONE_FORMAT"
);

// Conflict
throw AppError.conflict("Email already registered", "EMAIL_EXISTS");

// Internal error
throw AppError.internal("Failed to process payment", "PAYMENT_FAILED");
```

### 5. Creating Custom AppError Instances

```javascript
import AppError from "../utils/AppError.js";

// Any custom error
const error = new AppError(
  "Custom error message",
  422,
  "CUSTOM_CODE",
  { field: "reason" } // Optional details
);

throw error;
```

## Error Response Format

### Success Response (Development)

```json
{
  "success": false,
  "message": "User not found",
  "code": "USER_NOT_FOUND",
  "timestamp": "2024-04-05T10:30:00.000Z"
}
```

### Error Response with Details (Development Only)

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "timestamp": "2024-04-05T10:30:00.000Z",
  "details": [
    { "field": "email", "message": "Email is required" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

## HTTP Status Codes

The system uses standard HTTP status codes:

- **400**: Bad Request (Validation errors, invalid input)
- **401**: Unauthorized (Authentication failures)
- **403**: Forbidden (Authorization failures)
- **404**: Not Found (Resource doesn't exist)
- **409**: Conflict (Duplicate entries, conflicts)
- **413**: Payload Too Large (File size exceeded)
- **500**: Internal Server Error

## Migration Guide for Existing Code

### Before (Without Async Handler)

```javascript
export const loginUser = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      // Handle user
    })
    .catch(err => {
      // Handle error
    });
};
```

### After (With Error Handler)

```javascript
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const loginUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    throw AppError.notFound("User not found");
  }
  
  // Continue with logic
});
```

## Logging in Development vs Production

### Development (NODE_ENV=dev)

- Full error stack traces displayed
- Detailed error information
- Field-level validation errors
- Request path and method logged

### Production (NODE_ENV=production)

- Generic error messages
- No stack traces
- Essential info only: timestamp, error code, path, method, IP
- Safe for client exposure

## Best Practices

### ✅ DO

1. **Use AppError for known errors**

   ```javascript
   throw AppError.validation("Invalid input");
   ```

2. **Wrap async handlers with asyncHandler**

   ```javascript
   export const getUser = asyncHandler(async (req, res) => {
     // Code here
   });
   ```

3. **Throw errors instead of passing to next()**

   ```javascript
   throw AppError.notFound("User not found");
   ```

4. **Use appropriate error types**

   ```javascript
   // Use correct method for each error type
   AppError.authentication()
   AppError.authorization()
   AppError.validation()
   ```

### ❌ DON'T

1. **Don't expose stack traces in responses**

   ```javascript
   // BAD
   res.json({ error: error.stack });
   ```

2. **Don't leak sensitive information**

   ```javascript
   // BAD
   throw AppError.internal(`DB Connection: ${connectionString}`);
   ```

3. **Don't forget to use asyncHandler**

   ```javascript
   // BAD
   const getUser = async (req, res) => {
     // Unhandled errors will crash
   };
   ```

4. **Don't mix error handling styles**

   ```javascript
   // BAD - mixing callback and async
   const getUser = asyncHandler(async (req, res) => {
     someCallback((err, data) => {
       // This error won't be caught by asyncHandler
     });
   });
   ```

## Environment Variables

The error handler respects the `NODE_ENV` variable:

- `NODE_ENV=development` or `NODE_ENV=dev`: Full error details
- `NODE_ENV=production`: Security-first, minimal details

## Unhandled Error Handlers

The system catches:

1. **Unhandled Promise Rejections**: When a promise is rejected but not handled
2. **Uncaught Exceptions**: When synchronous code throws an error
3. **Process Warnings**: Generic warnings from Node.js

These are logged automatically and the process may exit if critical.

## Monitoring Integration

For production monitoring, you can integrate with services like:

- Sentry
- LogRocket
- DataDog
- CloudWatch
- Custom logging service

Example:

```javascript
// In unhandledErrorHandler.js
if (env.NODE_ENV === "production") {
  sendToMonitoring('unhandledRejection', { reason });
}
```

## Testing Error Handlers

### Test Validation Error

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": ""}'
```

### Test Not Found Error

```bash
curl http://localhost:3000/api/v1/nonexistent/route
```

### Test Authentication Error

```bash
curl -X GET http://localhost:3000/api/v1/protected \
  -H "Authorization: Bearer invalid-token"
```

## Support

For issues or questions about the error handling system, refer to this guide or contact the development team.
