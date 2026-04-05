# Security Implementation Guide - Error Handler

## Overview

This error handler system is built with **security as the top priority**. This document explains all security measures implemented and why they matter.

## 🔒 Security Layers

### Layer 1: Information Disclosure Prevention

#### Problem: Exposing Stack Traces

Attackers can use stack traces to:

- Identify framework versions and vulnerabilities
- Find internal code paths and logic flaws
- Discover database schemas and queries
- Locate potential injection points

#### Solution Implemented

```javascript
// Production (NODE_ENV=production)
// ❌ Stack traces are NEVER shown
response = {
  success: false,
  message: "An error occurred",
  code: "INTERNAL_ERROR"
}

// Development (NODE_ENV=dev)
// ✅ Stack traces shown for debugging
response = {
  success: false,
  message: "An error occurred",
  code: "INTERNAL_ERROR",
  stack: [...full stack trace...]
}
```

### Layer 2: Sensitive Data Concealment

#### Vulnerable Information to Hide

**Database Connection Errors**

```javascript
// ❌ DON'T expose this
throw {
  message: `MongoDB connection failed: mongodb://user:password@host:27017/database`,
  error: "Could not connect to database"
}

// ✅ Instead return:
message: "A database error occurred"
```

**API Keys and Credentials**

```javascript
// ❌ DON'T expose
message: `Cloudinary error: Key ABCD1234EFGH not found`

// ✅ Instead return:
message: "File upload service error"
```

**Internal File Paths**

```javascript
// ❌ DON'T expose
message: `File not found at /home/user/project/src/models/User.js:45`

// ✅ Instead return:
message: "Invalid request"
```

#### Solution Implemented

```javascript
// errorHandler.js sanitizes all error messages
const formatErrorResponse = (err, isDevelopment = false) => {
  // In production, only send generic message
  if (!isDevelopment) {
    message: "An error occurred" // No details exposed
  }
};
```

### Layer 3: Error Code-Based Handling

Instead of exposing error details, we use **error codes** for client-side handling:

```javascript
// Client receives error code, not details
{
  "success": false,
  "message": "Invalid request",
  "code": "EMAIL_EXISTS", // Client knows exactly what happened
  "timestamp": "2024-04-05T10:30:00.000Z"
}

// Client can handle this programmatically:
if (error.code === 'EMAIL_EXISTS') {
  showMessage('This email is already registered');
} else if (error.code === 'INVALID_EMAIL') {
  showMessage('Please enter a valid email');
}
```

### Layer 4: Validation Error Safety

**Dangerous Approach**

```javascript
// ❌ Exposes all validation details to attacker
errors: [
  { field: "email", message: "Email is required" },
  { field: "password", message: "Password must be min 8 chars" }
]
// Attacker can learn password requirements and try brute force
```

**Secure Approach (Development Only)**

```javascript
// Production: Generic message
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR"
}

// Development: Detailed for debugging
{
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    { field: "email", message: "Email is required" },
    { field: "password", message: "Password must be min 8 chars" }
  ]
}
```

#### Solution Implemented

```javascript
// errorHandler.js
if (isDevelopment && err.details) {
  response.details = err.details; // Only in dev
}
```

### Layer 5: Database Error Hiding

**Dangerous Database Errors**

```javascript
// ❌ Exposes query structure
message: "Cannot insert null into NOT NULL column 'email' at line 3 of migration"

// ❌ Exposes table structure
message: "Duplicate key error on index 'users_email_idx' on key { email: 1 }"

// ❌ Exposes authentication
message: "Connection refused to mongodb://admin:pass@db:27017"

// ❌ Reveals schema
message: "Field 'phoneNumber' must be numeric, got string '123abc'"
```

**Secure Handling**

```javascript
// Production: Generic message
message: "A database error occurred"

// Development: Detailed message
message: `Database error: ${err.message}`

// errorHandler.js handles these automatically:
if (err.name === "MongoServerError" || err.name === "MongoNetworkError") {
  if (isDevelopment) {
    message = `Database error: ${err.message}`
  } else {
    message = "A database error occurred"
  }
}
```

### Layer 6: JWT Error Safety

**Vulnerable JWT Handling**

```javascript
// ❌ Reveals token structure
message: "Invalid JWT signature. Expected RS256, got HS256"

// ❌ Reveals algorithm change
message: "Token algorithm changed from RS256 to none"

// ❌ Key exposure
message: "Token verification failed using key: sk_123456..."
```

**Secure Handling**

```javascript
// Always generic for JWT
message: "Invalid token" // No algorithm details
message: "Token has expired" // Generic expiry message

// errorHandler.js:
if (err.name === "JsonWebTokenError") {
  message = "Invalid token"; // Never expose what's wrong
}
if (err.name === "TokenExpiredError") {
  message = "Token has expired"; // Generic, no timestamps
}
```

### Layer 7: File Upload Security

**Dangerous File Upload Errors**

```javascript
// ❌ Reveals upload path
message: `Uploaded to /var/www/uploads/2024/03/file_abc123.jpg`

// ❌ Reveals system info
message: `Disk full. /dev/sda1 has 0 bytes remaining`

// ❌ Reveals mime type validation
message: `File type 'application/x-elf' not allowed. Allowed: image/jpeg, image/png`
```

**Secure Handling**

```javascript
// Production: Generic
message: "File upload failed"

// Development: Helpful
message: "File upload failed: Invalid file type"

// errorHandler.js:
if (err.code === "LIMIT_UNEXPECTED_FILE") {
  message = "Unsupported file type"; // No details
}
```

### Layer 8: IP-Based Security in Logging

**What NOT to log publicly**

```javascript
// ❌ Avoid logging to client
"ip": "192.168.1.100", // Can reveal private networks
User-Agent that reveals Windows Home version
Referrer showing previous pages
```

**Server-Side Only Logging**

```javascript
// Safe to log internally (server console only)
{
  "ip": req.ip,
  "userAgent": req.get("user-agent"),
  "method": req.method,
  "path": req.path,
  "timestamp": new Date().toISOString()
}
```

#### Solution Implemented

```javascript
// errorHandler.js - Server-side logging only
if (isDevelopment) {
  // Development: Full logging
  console.error({
    message: error.message,
    path: req.path,
    method: req.method,
    stack: err.stack
  });
} else {
  // Production: Basic logging only
  console.error({
    message: error.message,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip, // For security monitoring
    timestamp: error.timestamp
  });
}
```

## 🛡️ Attack Prevention

### 1. Information Gathering Attack

**Attack**: Attacker probes endpoints to gather system info
**Prevention**: Always return generic errors

```javascript
// Same response for missing field or DB error
"message": "An error occurred"
```

### 2. Stack Trace Exploitation

**Attack**: Use stack trace to find vulnerabilities
**Prevention**: No stack traces in production

```javascript
// Production: No stack
// Development: Stack for debugging only
```

### 3. Parameter Pollution

**Attack**: Send invalid parameters to learn schema
**Prevention**: Generic validation errors

```javascript
// Instead of:
"invalid fields: email, phone, address"
// Return:
"Validation failed"
```

### 4. SQL/NoSQL Injection via Error Messages

**Attack**: Inject code in error messages to learn query structure
**Prevention**: Never expose queries or field names

```javascript
// Never show:
"Query failed: db.users.find({email: '$injection'})"
// Instead:
"Query execution failed"
```

### 5. Algorithm Confusion Attack (JWT)

**Attack**: Change JWT algorithm to bypass verification
**Prevention**: Never expose which algorithm failed

```javascript
// Instead of:
"Algorithm mismatch: RS256 expected, got none"
// Always:
"Invalid token"
```

### 6. Rate Limit Enumeration

**Attack**: Use 429 status to enumerate valid endpoints
**Prevention**: Generic 429 without revealing bypass methods

```javascript
// Return same rate limit header for all services
// Don't reveal: "Premium users get 1000 req/min"
```

## ✅ Security Checklist

- [ ] Never show stack traces in production
- [ ] Never expose database connection strings
- [ ] Never reveal API keys in error messages
- [ ] Never show table/collection names in errors
- [ ] Never expose query structure
- [ ] Never reveal which field validations fail (in generic responses)
- [ ] Use error codes for client handling, not details
- [ ] Only log sensitive data server-side
- [ ] Always return consistent error status codes
- [ ] Hide internal file paths in errors
- [ ] Don't expose response times that reveal DB structure
- [ ] Sanitize user input in error messages
- [ ] Test error responses in production-like environment

## 🔧 Configuration for Different Environments

### Development

```bash
NODE_ENV=dev
# or
NODE_ENV=development
```

- Stack traces shown ✅
- Detailed error messages ✅
- Field-level validation errors ✅
- Full logging ✅

### Production

```bash
NODE_ENV=production
```

- Stack traces hidden ✅
- Generic error messages ✅
- No validation details ✅
- Safe logging only ✅

### Staging (Optional)

```bash
NODE_ENV=staging
```

Consider using production settings for staging too, to catch security issues before production.

## 📊 Error Response Examples

### Development: Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "timestamp": "2024-04-05T10:30:00.000Z",
  "details": [
    { "field": "email", "message": "Email is required" },
    { "field": "password", "message": "Must be at least 8 characters" }
  ]
}
```

### Production: Same Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "timestamp": "2024-04-05T10:30:00.000Z"
}
```

### Development: Database Error

```json
{
  "success": false,
  "message": "Database error: Connection refused",
  "code": "DATABASE_ERROR",
  "timestamp": "2024-04-05T10:30:00.000Z",
  "stack": ["at connectDB (config/db.js:15)", "at startServer (server.js:10)"]
}
```

### Production: Same Database Error

```json
{
  "success": false,
  "message": "A database error occurred",
  "code": "INTERNAL_ERROR",
  "timestamp": "2024-04-05T10:30:00.000Z"
}
```

## 🚨 Monitoring in Production

Even though we hide details from clients, we need monitoring:

```javascript
// In unhandledErrorHandler.js, integrate with services:
if (env.NODE_ENV === "production") {
  // Send to Sentry, LogRocket, DataDog, etc.
  sendToMonitoringService({
    message: error.message,
    stack: error.stack,
    code: error.code,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
}
```

## 🔍 Common Security Mistakes to Avoid

### ❌ Mistake 1: Logging User Input

```javascript
// BAD: Logs user input unfiltered
console.error(`User provided invalid data: ${JSON.stringify(req.body)}`);
```

### ✅ Correct: Sanitize Logging

```javascript
// GOOD: Only log what's needed
console.error("Validation failed for user email field");
```

### ❌ Mistake 2: Showing Database Queries

```javascript
// BAD
message: `Query failed: ${mongoQuery}`
```

### ✅ Correct: Generic Message

```javascript
// GOOD
message: "Database operation failed"
```

### ❌ Mistake 3: Exposing Secrets

```javascript
// BAD
message: `Cloudinary API Key ${cloudinaryKey} is invalid`
```

### ✅ Correct: No Secrets

```javascript
// GOOD
message: "Image upload service error"
```

## 📚 Further Reading

- OWASP Error Handling: <https://owasp.org/www-community/Improper_Error_Handling>
- CWE-209: Information Exposure Through Error Message: <https://cwe.mitre.org/data/definitions/209.html>
- OWASP Sensitive Data Exposure: <https://owasp.org/www-project-top-ten/>
- Express Security Best Practices: <https://expressjs.com/en/advanced/best-practice-security.html>

## 🤝 Support

For security questions or to report vulnerabilities, contact the security team.
