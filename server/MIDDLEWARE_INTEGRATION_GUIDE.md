# Middleware Integration Guide - Error Handler

## Overview

This guide shows how to integrate the global error handler with various middleware patterns commonly used in Express applications.

## 1. Auth Middleware with Error Handler

### ❌ Before (Manual Error Handling)

```javascript
export const authenticate = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};
```

### ✅ After (Using Error Handler)

```javascript
import AppError from "../utils/AppError.js";

export const authenticate = (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      throw AppError.authentication("Missing authentication token", "NO_TOKEN");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // JWT errors will be handled by errorHandler
    // Custom errors will be thrown
    if (error.isOperational) {
      next(error);
    } else if (error.name === "JsonWebTokenError") {
      next(AppError.authentication("Invalid token", "INVALID_TOKEN"));
    } else {
      next(error);
    }
  }
};
```

## 2. Authorization Middleware

### ✅ Using Error Handler

```javascript
import AppError from "../utils/AppError.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw AppError.authentication("User not authenticated", "NOT_AUTHENTICATED");
    }

    if (!roles.includes(req.user.role)) {
      throw AppError.authorization(
        "You don't have permission to access this resource",
        "INSUFFICIENT_PERMISSION"
      );
    }

    next();
  };
};

// Usage in routes:
// router.delete('/user/:id', authenticate, authorize('admin'), deleteUser);
```

## 3. Validation Middleware

### ❌ Before

```javascript
const validateEmail = (req, res, next) => {
  const email = req.body.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
      field: "email"
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
      field: "email"
    });
  }

  next();
};
```

### ✅ After (Using Error Handler)

```javascript
import AppError from "../utils/AppError.js";

export const validateEmail = (req, res, next) => {
  const email = req.body.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    throw AppError.validation("Email is required", "EMAIL_REQUIRED");
  }

  if (!emailRegex.test(email)) {
    throw AppError.validation("Invalid email format", "INVALID_EMAIL_FORMAT");
  }

  next();
};

// OR use as middleware wrapper:
export const validateEmailAsync = (req, res, next) => {
  try {
    validateEmail(req, res, next);
  } catch (error) {
    next(error);
  }
};
```

## 4. Multer Error Handling

### ❌ Before

```javascript
const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (!allowedMimes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
    } else {
      cb(null, true);
    }
  }
});

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ success: true, file: req.file });
});
```

### ✅ After (Using Error Handler)

```javascript
import AppError from "../utils/AppError.js";

const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (!allowedMimes.includes(file.mimetype)) {
      cb(AppError.badRequest("Invalid file type", "INVALID_FILE_TYPE"));
    } else {
      cb(null, true);
    }
  }
});

// Error handling middleware for Multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return next(AppError.badRequest("File size exceeds limit", "FILE_TOO_LARGE"));
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(AppError.badRequest("Too many files", "FILE_COUNT_EXCEEDED"));
    }
  }
  
  if (err instanceof AppError) {
    return next(err);
  }

  next(err);
};

router.post(
  '/upload',
  upload.single('file'),
  handleMulterError, // Add error handler after upload
  uploadFile
);
```

## 5. Rate Limiting Middleware

### ✅ Using Error Handler

```javascript
import rateLimit from "express-rate-limit";
import AppError from "../utils/AppError.js";

export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      next(AppError.badRequest(
        message || "Too many requests",
        "RATE_LIMIT_EXCEEDED"
      ));
    }
  });
};

// Usage:
const loginLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // max 5 attempts
  "Too many login attempts"
);

router.post("/login", loginLimiter, loginUser);
```

## 6. CORS Error Handling

### ✅ Using Error Handler

```javascript
import cors from "cors";
import AppError from "../utils/AppError.js";

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(AppError.authorization(
        "Origin not allowed by CORS policy",
        "CORS_NOT_ALLOWED"
      ));
    }
  },
  credentials: true
}));
```

## 7. Body Parsing Error Handling

### ✅ Using Error Handler

```javascript
import express from "express";
import AppError from "../utils/AppError.js";

// Builtin body parser error handler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Catch parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return next(AppError.badRequest("Invalid JSON", "INVALID_JSON"));
  }
  
  if (err instanceof URIError) {
    return next(AppError.badRequest("Invalid URL encoding", "INVALID_URL_ENCODING"));
  }
  
  next(err);
});
```

## 8. Custom Business Logic Middleware

### ✅ Using Error Handler

```javascript
import AppError from "../utils/AppError.js";

// Check if user owns the resource
export const checkResourceOwnership = async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const userId = req.user?.id;

    // This will throw if document not found
    const resource = await Resource.findById(resourceId);
    
    if (!resource) {
      throw AppError.notFound("Resource not found", "RESOURCE_NOT_FOUND");
    }

    if (resource.owner !== userId && req.user.role !== "admin") {
      throw AppError.authorization(
        "You don't own this resource",
        "NOT_OWNER"
      );
    }

    req.resource = resource;
    next();
  } catch (error) {
    next(error);
  }
};
```

## 9. Database Connection Middleware

### ✅ Using Error Handler

```javascript
import AppError from "../utils/AppError.js";

export const checkDatabaseConnection = async (req, res, next) => {
  try {
    // Test database connection
    await mongoose.connection.db.admin().ping();
    next();
  } catch (error) {
    next(AppError.internal(
      "Database connection error",
      "DB_CONNECTION_ERROR"
    ));
  }
};

// Optional: Add to health check routes only
router.get("/health", checkDatabaseConnection, (req, res) => {
  res.json({ status: "ok" });
});
```

## 10. Comprehensive Middleware Chain

### ✅ Complete Example

```javascript
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { authenticate, authorize } from "./middlewares/authMiddleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => {
    next(AppError.badRequest(
      "Too many requests",
      "RATE_LIMIT_EXCEEDED"
    ));
  }
});
app.use(globalLimiter);

// Parsing error handler (before routes)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return next(AppError.badRequest("Invalid JSON", "INVALID_JSON"));
  }
  next(err);
});

// Routes with middleware
app.post("/login", loginLimiter, loginController);
app.get("/profile", authenticate, profileController);
app.delete("/user/:id", authenticate, authorize("admin"), deleteUserController);

// 404 handler
app.use(notFoundHandler);

// Global error handler (MUST be last)
app.use(errorHandler);

export default app;
```

## 11. Custom Error Codes Reference

Use these codes for consistent client-side error handling:

### Authentication & Authorization

- `NO_TOKEN` - Authentication token missing
- `INVALID_TOKEN` - Token is malformed or invalid
- `TOKEN_EXPIRED` - Token has expired
- `NOT_AUTHENTICATED` - User not logged in
- `INSUFFICIENT_PERMISSION` - User lacks required role/permission
- `NOT_OWNER` - User doesn't own the resource

### Validation Errors

- `VALIDATION_ERROR` - General validation failure
- `EMAIL_REQUIRED` - Email field missing
- `INVALID_EMAIL_FORMAT` - Email format invalid
- `PASSWORD_REQUIRED` - Password field missing
- `INVALID_PASSWORD_FORMAT` - Password doesn't meet requirements
- `MISSING_FIELDS` - Required fields missing

### Resource Errors

- `RESOURCE_NOT_FOUND` - Resource doesn't exist
- `USER_NOT_FOUND` - User doesn't exist
- `EMAIL_EXISTS` - Email already registered
- `DUPLICATE_FIELD` - Duplicate value in unique field

### File Errors

- `FILE_REQUIRED` - No file provided
- `FILE_TOO_LARGE` - File exceeds size limit
- `INVALID_FILE_TYPE` - Unsupported file type
- `FILE_COUNT_EXCEEDED` - Too many files uploaded

### Request Errors

- `INVALID_ID` - Invalid MongoDB ObjectId
- `INVALID_JSON` - Malformed JSON in request body
- `INVALID_QUERY_PARAMS` - Invalid query parameters
- `RATE_LIMIT_EXCEEDED` - Too many requests

### Business Logic Errors

- `PAYMENT_FAILED` - Payment processing failure
- `ORDER_EXISTS` - Duplicate order
- `INSUFFICIENT_STOCK` - Item out of stock
- `INVALID_COUPON` - Coupon code invalid
- `EXPIRED_COUPON` - Coupon has expired

### System Errors

- `INTERNAL_ERROR` - Generic server error
- `DATABASE_ERROR` - Database operation failed
- `DB_CONNECTION_ERROR` - Database connection failed
- `SERVICE_ERROR` - External service failure
- `CORS_NOT_ALLOWED` - CORS policy violation

## 12. Testing Error Scenarios

### Test Validation Error

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Test Authentication Error

```bash
curl -X GET http://localhost:3000/api/v1/protected
```

### Test Invalid JSON

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{invalid json}'
```

### Test 404

```bash
curl -X GET http://localhost:3000/api/v1/nonexistent/endpoint
```

### Test Rate Limiting

```bash
# Run this multiple times quickly
for i in {1..10}; do
  curl http://localhost:3000/api/v1/auth/login
done
```

## Debugging Errors in Development

### Enable Detailed Logging

```javascript
// Set in .env
NODE_ENV=dev
DEBUG=app:*
```

### Check Error Middleware Order

```javascript
// ✅ CORRECT ORDER:
app.use(express.json()); // Parse before routes
app.use(routes); // Routes after parsing
app.use(notFoundHandler); // 404 before error handler
app.use(errorHandler); // Error handler LAST

// ❌ WRONG:
app.use(errorHandler); // Places error handler too early
app.use(routes); // Routes after error handler won't work
```

## Common Mistakes to Avoid

1. **❌ Not wrapping async handlers**
   - Use `asyncHandler()` for all async controllers

2. **❌ Mixing next() and throw**
   - Choose one pattern and stick with it

3. **❌ Error handler not at the end**
   - Must be the last middleware in app.js

4. **❌ Catching errors from next()**
   - Error handler catches from next(), don't double-handle

5. **❌ Synchronous middleware throwing in async context**
   - Ensure proper error propagation

## Best Practices Summary

1. ✅ Wrap all async handlers with `asyncHandler()`
2. ✅ Use `AppError` static methods for consistency
3. ✅ Place error handler middleware last
4. ✅ Use appropriate error codes for client handling
5. ✅ Never expose sensitive information
6. ✅ Log only essential info in production
7. ✅ Test error scenarios before deployment
8. ✅ Keep error messages user-friendly
9. ✅ Document custom error codes
10. ✅ Monitor errors in production

