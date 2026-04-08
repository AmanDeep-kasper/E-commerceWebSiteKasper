# 🔐 Admin User Creation Guide

## Overview

यह एक **secure** admin creation system है जो सिर्फ एक बार चले। 3 तरीके हैं admin बनाने के:

1. **Seeding Script** (अनुशंसित) - सिर्फ एक बार चलेगा
2. **API Route** - Secure secret key से protect है
3. **Manual Database Entry** - Emergency backup

---

## 🎯 Method 1: Seeding Script (Recommended)

### Setup:

3 तरीके से environment variables set करो:

#### Option A: `.env` file में
```env
ADMIN_EMAIL=admin@ecommerce.com
ADMIN_PASSWORD=YourSecurePassword@123
ADMIN_NAME=Admin User
MONGO_URI=mongodb://localhost:27017/ecommerce
```

#### Option B: Command line में
```bash
ADMIN_EMAIL=admin@company.com \
ADMIN_PASSWORD=SecurePass@456 \
ADMIN_NAME="Company Admin" \
npm run seed:admin
```

#### Option C: Development shortcut
```bash
npm run seed:admin:dev
# Uses: email=admin@localhost.com, password=Dev@12345
```

### Run:

```bash
npm run seed:admin
```

### Output:
```
📦 Connecting to MongoDB...
✅ MongoDB connected

🔍 Checking for existing admin...
✅ No existing admin found

👨‍💼 Creating new admin user...
✅ Admin created successfully!

📋 Admin Details:
   ID: 507f1f77bcf36cd799439011
   Name: Admin User
   Email: admin@ecommerce.com
   Role: admin
   Status: Active
   Verified: true
   Created: 2026-04-05T09:30:00.000Z

🔐 Security Note:
   ⚠️  Please change the admin password immediately!
   ℹ️  Use the 'Change Password' feature after first login
```

### Safety:
- ✅ Idempotent: Running it multiple times won't create duplicate admins
- ✅ Checks if admin already exists
- ✅ Safe error handling
- ✅ Logs all operations

---

## 🌐 Method 2: Secure API Route

### Endpoint:
```
POST /api/auth/admin/create
```

### Prerequisites:

Set secret key in `.env`:
```env
ADMIN_CREATION_SECRET_KEY=your_super_secret_key_12345
```

### Request:

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "SecurePassword@123",
  "secretKey": "your_super_secret_key_12345"
}
```

### cURL Example:
```bash
curl -X POST http://localhost:5000/api/auth/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@company.com",
    "password": "SecurePassword@123",
    "secretKey": "your_super_secret_key_12345"
  }'
```

### Postman Example:
1. New Request → POST
2. URL: `http://localhost:5000/api/auth/admin/create`
3. Body (raw JSON):
```json
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "SecurePassword@123",
  "secretKey": "your_super_secret_key_12345"
}
```

### Success Response:
```json
{
  "success": true,
  "message": "Admin created and logged in successfully",
  "admin": {
    "id": "507f1f77bcf36cd799439011",
    "name": "Admin User",
    "email": "admin@company.com",
    "role": "admin",
    "createdAt": "2026-04-05T09:30:00.000Z"
  },
  "session": {
    "id": "abcd1234...",
    "expiresIn": "15m",
    "tokenType": "Bearer"
  }
}
```

### Error Responses:

**No admin secret configured:**
```json
{
  "success": false,
  "message": "Admin creation is not configured...",
  "code": "ADMIN_CREATION_NOT_CONFIGURED"
}
```

**Invalid secret key:**
```json
{
  "success": false,
  "message": "Invalid secret key. Admin creation failed.",
  "code": "INVALID_SECRET_KEY"
}
```

**Admin already exists:**
```json
{
  "success": false,
  "message": "An admin user already exists. Cannot create another admin.",
  "code": "ADMIN_ALREADY_EXISTS"
}
```

### Security Features:
- ✅ Secret key required (not in token, direct comparison)
- ✅ Only works if no admin exists
- ✅ IP logging of all attempts
- ✅ Generates login tokens automatically
- ❌ Invalid attempts are logged as warnings

---

## 🔧 Method 3: Manual Database Entry (Emergency)

### Using MongoDB Shell:

```javascript
// Connect to your database
use ecommerce

// Check if admin exists
db.users.findOne({ role: "admin" })

// If empty, run this (hash password manually or before)
db.users.insertOne({
  name: "Admin User",
  email: "admin@company.com",
  password: "$2b$12$...", // bcrypt hashed password
  role: "admin",
  isVerified: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Using MongoDB Compass:
1. Open MongoDB Compass
2. Navigate to `ecommerce` → `users` collection
3. Click "INSERT DOCUMENT"
4. Paste your document
5. Click INSERT

⚠️ **Important:** Password must be bcryptjs hashed (cost: 12)

---

## 🔒 Security Best Practices

### ✅ Do:
- [ ] Use strong password (min 8 chars, mix case, numbers, symbols)
- [ ] Keep `ADMIN_CREATION_SECRET_KEY` very secure
- [ ] Change admin password immediately after creation
- [ ] Use different email for admin (not shared)
- [ ] Enable 2FA if available
- [ ] Remove `ADMIN_CREATION_SECRET_KEY` from `.env` after first use
- [ ] Keep logs for audit trail

### ❌ Don't:
- [ ] Use weak passwords like "admin", "123456"
- [ ] Share secret key publicly or in git
- [ ] Commit `.env` to version control
- [ ] Use same password as development DB
- [ ] Keep creation secret keys in code
- [ ] Use admin account for regular tasks

---

## 🧪 Testing

### Test that admin cannot be created twice:

```bash
# First run - SUCCESS
npm run seed:admin

# Second run - SKIPPED (admin already exists)
npm run seed:admin
```

### Test API rate limiting:

```bash
# Will reject invalid secret key (logged as warning)
curl -X POST http://localhost:5000/api/auth/admin/create \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "wrong_key", ...}'
```

### Test that only first admin can be created:

```bash
# Using API endpoint after admin exists
curl -X POST http://localhost:5000/api/auth/admin/create \
  # Returns: ADMIN_ALREADY_EXISTS error
```

---

## 📝 Environment Configuration

### Development:
```env
NODE_ENV=development
ADMIN_EMAIL=admin@localhost.com
ADMIN_PASSWORD=Dev@12345
ADMIN_NAME=Local Admin
ADMIN_CREATION_SECRET_KEY=dev_secret_key_only
MONGO_URI=mongodb://localhost:27017/ecommerce
```

### Production:
```env
NODE_ENV=production
ADMIN_EMAIL=admin@company.com
ADMIN_PASSWORD=[STRONG_PASSWORD]
ADMIN_NAME=Admin User
ADMIN_CREATION_SECRET_KEY=[VERY_LONG_SECURE_KEY]
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
```

---

## 🚀 Deployment Checklist

- [ ] Set all required env variables on hosting platform
- [ ] Run seed script after deploying (`npm run seed:admin`)
- [ ] Verify admin user created in database
- [ ] Remove/disable admin creation secret key after use
- [ ] Test login with admin credentials
- [ ] Change admin password on first login
- [ ] Enable monitoring/logging for admin accounts
- [ ] Keep backup of admin creation credentials (secure location)

---

## 🔄 Production Workflow

### Initial Setup:
1. Deploy application
2. Run: `npm run seed:admin` (uses env vars)
3. Verify admin created
4. Remove `ADMIN_CREATION_SECRET_KEY` from env
5. Take backup of admin credentials (secure location)

### Future Admin Creation (if needed):
- Use existing admin account to create new admins
- Never use the seed script again (it can be locked)
- Keep seed script only for emergency recovery

---

## 📊 Admin User Fields

```javascript
{
  _id: ObjectId,
  name: "Admin User",
  email: "admin@company.com",
  password: "[bcrypt_hashed]", // Never exposed
  role: "admin",
  isVerified: true,
  isActive: true,
  profileImage: {
    url: null,
    publicId: null
  },
  refreshTokens: [], // Will be populated on login
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🆘 Troubleshooting

### "Admin already exists"
- Admin user already in database
- Solution: Use different email or delete admin and retry

### "Invalid secret key"
- Wrong `ADMIN_CREATION_SECRET_KEY`
- Solution: Check env variable spelling and value

### "Cannot connect to database"
- `MONGO_URI` is incorrect
- MongoDB service not running
- Solution: Check MongoDB connection string

### "Email already exists"
- Email belongs to non-admin user
- Solution: Use different email

---

## 🎓 Learning Resources

- [Bcryptjs Docs](https://github.com/dcodeIO/bcrypt.js)
- [Mongoose Models](https://mongoosejs.com/docs/models.html)
- [Environment Variables](https://12factor.net/config)
- [Seed Scripts Pattern](https://en.wikipedia.org/wiki/Seed_data)

---

## 📞 Support

Need help? Check:
1. Server logs for detailed errors
2. MongoDB connection status
3. Environment variables set correctly
4. Admin credentials used for login

---

**Last Updated:** April 5, 2026  
**Version:** 1.0.0
