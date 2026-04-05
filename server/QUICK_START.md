# Quick Start - Global Error Handler

## 📋 What's Been Added

Your project now has a **production-ready, security-first error handling system** with 4 new core files:

```
server/
├── src/
│   ├── middlewares/
│   │   └── errorHandler.js          ← Global error handler middleware
│   ├── utils/
│   │   ├── AppError.js              ← Custom error class
│   │   ├── asyncHandler.js          ← Async error wrapper
│   │   └── unhandledErrorHandler.js ← Process-level error handlers
│   ├── app.js                       ← UPDATED
│   └── server.js                    ← UPDATED
└── Documentation/
    ├── ERROR_HANDLER_GUIDE.md           ← Full guide
    ├── SECURITY_GUIDE.md                ← Security details
    └── MIDDLEWARE_INTEGRATION_GUIDE.md  ← Integration patterns
```

## 🚀 Get Started in 2 Minutes

### Step 1: Wrap Your Controller Functions

```javascript
// Before
export const myController = async (req, res) => {
  // code
};

// After
import { asyncHandler } from "../utils/asyncHandler.js";

export const myController = asyncHandler(async (req, res) => {
  // code
});
```

### Step 2: Throw Errors with AppError

```javascript
import AppError from "../utils/AppError.js";

export const myController = asyncHandler(async (req, res) => {
  const user = await User.findById(id);
  
  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }
  
  res.status(200).json({ success: true, data: user });
});
```

### Step 3: Done! ✅

The global error handler catches all errors automatically.

## 📚 AppError Usage Patterns

```javascript
import AppError from "../utils/AppError.js";

// Validation errors
throw AppError.validation("Email is required", "EMAIL_REQUIRED");
throw AppError.validation("Invalid input", "VALIDATION_ERROR", { field: "reason" });

// Authentication errors
throw AppError.authentication("Invalid credentials", "INVALID_CREDENTIALS");

// Authorization errors
throw AppError.authorization("Access forbidden", "INSUFFICIENT_PERMISSION");

// Not found errors
throw AppError.notFound("User not found", "USER_NOT_FOUND");

// Conflict errors
throw AppError.conflict("Email already exists", "EMAIL_EXISTS");

// Bad request errors
throw AppError.badRequest("Invalid format", "INVALID_FORMAT");

// Internal errors
throw AppError.internal("Payment failed", "PAYMENT_FAILED");
```

## 🔒 Security Features

✅ **Production-Safe**: No stack traces, no sensitive data exposed  
✅ **Development-Friendly**: Full details for debugging  
✅ **Consistent Errors**: All responses follow same format  
✅ **Error Codes**: Clients get codes instead of details  
✅ **Automatic Handling**: Mongoose, JWT, Multer errors handled automatically  

## 📊 Error Response Format

```json
{
  "success": false,
  "message": "User not found",
  "code": "USER_NOT_FOUND",
  "timestamp": "2024-04-05T10:30:00.000Z"
}
```

## 🛠️ Automatic Error Handling

These errors are automatically converted to proper responses:

- **Mongoose Validation Errors** → 400 `VALIDATION_ERROR`
- **Duplicate Key Errors** → 409 `DUPLICATE_FIELD`
- **Invalid ObjectId** → 400 `INVALID_ID`
- **JWT Errors** → 401 `INVALID_TOKEN`
- **Expired Token** → 401 `TOKEN_EXPIRED`
- **File Size Exceeded** → 413 `FILE_TOO_LARGE`
- **Unsupported File Type** → 400 `UNSUPPORTED_FILE_TYPE`
- **Missing Routes** → 404 `ROUTE_NOT_FOUND`

## ✨ What You Get

### 1️⃣ Global Error Handler

Catches all errors and returns consistent responses

### 2️⃣ Async Wrapper

Eliminates need for try-catch in controllers

### 3️⃣ Custom AppError Class

Consistent error creation and categorization

### 4️⃣ Unhandled Error Handlers

Catches promise rejections and uncaught exceptions

### 5️⃣ Smart Logging

- Production: Safe, minimal logging
- Development: Full details for debugging

## 📝 Checklist for Migration

For **each existing controller**:

- [ ] Add import: `import { asyncHandler } from "../utils/asyncHandler.js";`
- [ ] Add import: `import AppError from "../utils/AppError.js";`
- [ ] Replace `function()` with `asyncHandler(function())`
- [ ] Remove `try-catch` blocks
- [ ] Replace `res.status(400).json(...)` with `throw AppError.validation(...)`
- [ ] Replace `res.status(401).json(...)` with `throw AppError.authentication(...)`
- [ ] Replace `res.status(403).json(...)` with `throw AppError.authorization(...)`
- [ ] Replace `res.status(404).json(...)` with `throw AppError.notFound(...)`
- [ ] Test the endpoint

## 🧪 Test It Now

### Test Missing Token

```bash
curl http://localhost:3000/api/v1/protected
```

### Test Invalid Input

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":""}'
```

### Test Invalid Route

```bash
curl http://localhost:3000/api/v1/nonexistent
```

## 🔧 Configuration

### Development Mode

```bash
NODE_ENV=dev
```

Shows full errors, stack traces, and debugging details

### Production Mode

```bash
NODE_ENV=production
```

Shows only safe, generic errors. No sensitive data exposed.

## 📖 Full Documentation

- **ERROR_HANDLER_GUIDE.md** - Complete usage guide with examples
- **SECURITY_GUIDE.md** - Security details and attack prevention
- **MIDDLEWARE_INTEGRATION_GUIDE.md** - How to integrate with middleware

## 🆘 Common Questions

**Q: Do I need to wrap synchronous functions?**  
A: No, only async functions. Sync functions don't need asyncHandler.

**Q: What if I want to handle an error differently?**  
A: Catch it before throwing, then throw a different AppError.

**Q: Can I add custom error codes?**  
A: Yes! Just create the code when throwing:

```javascript
throw new AppError("Custom message", 400, "MY_CUSTOM_CODE");
```

**Q: How do I log errors?**  
A: The error handler logs automatically. In development, you get full details.

**Q: Can I customize the error response?**  
A: The format is standardized for security. See SECURITY_GUIDE.md for details.

## 🎯 Next Steps

1. ✅ Review the documentation files (already done!)
2. ⏭️ Update one controller as test (use EXAMPLE_ERROR_HANDLING.js as reference)
3. ⏭️ Test the endpoint with invalid data
4. ⏭️ Migrate remaining controllers
5. ⏭️ Deploy and monitor

## 📞 Support

All documentation is in the server folder:

- `ERROR_HANDLER_GUIDE.md` - Full reference
- `SECURITY_GUIDE.md` - Security deep dive
- `MIDDLEWARE_INTEGRATION_GUIDE.md` - Integration patterns
- `src/controllers/EXAMPLE_ERROR_HANDLING.js` - Code examples

---

**Happy coding! Your error handling is now production-ready and secure.** 🚀
