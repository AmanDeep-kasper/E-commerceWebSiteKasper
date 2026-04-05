/**
 * EXAMPLE: How to Update Controllers to Use Global Error Handler
 * 
 * This file shows the pattern for migrating existing controllers
 * to use the new error handling system.
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// ============================================
// STEP 1: Import Required Modules
// ============================================
// import { asyncHandler, catchAsync } from "../utils/asyncHandler.js";
// import AppError from "../utils/AppError.js";

// ============================================
// STEP 2: Wrap Controller with asyncHandler
// ============================================

// BEFORE: Traditional try-catch (Manual error handling)
/*
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
*/

// AFTER: Using asyncHandler (Automatic error handling)
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw AppError.notFound("User not found", "USER_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// ============================================
// STEP 3: Use AppError for Different Error Types
// ============================================

// Example: Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Validation errors
  if (!email || !password) {
    throw AppError.validation(
      "Email and password are required",
      "MISSING_FIELDS",
      {
        email: email ? null : "Email is required",
        password: password ? null : "Password is required",
      },
    );
  }

  // Check if user exists (conflict error)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw AppError.conflict("Email already registered", "EMAIL_EXISTS");
  }

  // Create user
  const user = await User.create({ email, password, name });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

// Example: Update User Profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;
  const userId = req.user?.id; // From auth middleware

  // Authentication check (if not done by middleware)
  if (!userId) {
    throw AppError.authentication("Please log in to continue");
  }

  // Find and update user
  const user = await User.findByIdAndUpdate(
    userId,
    { name, phone, address },
    { new: true, runValidators: true },
  );

  if (!user) {
    throw AppError.notFound("User not found");
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

// Example: Delete User with Authorization Check
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const currentUserId = req.user?.id;
  const userRole = req.user?.role;

  // Authorization check
  if (userId !== currentUserId && userRole !== "admin") {
    throw AppError.authorization(
      "You don't have permission to delete this user",
      "INSUFFICIENT_PERMISSION",
    );
  }

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw AppError.notFound("User not found");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// Example: File Upload with Error Handling
export const uploadProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  // File validation
  if (!req.file) {
    throw AppError.badRequest("No file provided", "FILE_REQUIRED");
  }

  // Check file size (Multer will handle this too, but we can add custom logic)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (req.file.size > maxSize) {
    throw AppError.badRequest(
      "File size must not exceed 5MB",
      "FILE_TOO_LARGE",
    );
  }

  // Upload to Cloudinary or storage
  const uploadResult = await uploadToCloudinary(req.file);

  // Update user with image
  const user = await User.findByIdAndUpdate(
    userId,
    { profileImage: uploadResult.url },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Profile image updated successfully",
    data: user,
  });
});

// ============================================
// STEP 4: Handle Mongoose Errors Automatically
// ============================================

// The error handler will automatically convert:
// - ValidationError → 400 with "VALIDATION_ERROR"
// - CastError (invalid ID) → 400 with "INVALID_ID"
// - Duplicate key error → 409 with "DUPLICATE_FIELD"
// - Connection errors → 500 with appropriate code

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, category } = req.body;

  // These errors are automatically handled by errorHandler middleware:
  // 1. If validation fails: returns 400
  // 2. If duplicate: returns 409
  // 3. If connection fails: returns 500
  const product = await Product.create({
    name,
    price,
    category,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

// ============================================
// STEP 5: Custom Error Codes for Client Handling
// ============================================

export const processPayment = asyncHandler(async (req, res) => {
  const { orderId, amount } = req.body;

  try {
    const result = await paymentGateway.charge(amount);

    if (!result.success) {
      throw AppError.badRequest(
        "Payment processing failed",
        "PAYMENT_FAILED",
        {
          reason: result.error,
          code: result.errorCode,
        },
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: "paid", transactionId: result.id },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Payment successful",
      data: order,
    });
  } catch (error) {
    // If it's already an AppError, just throw it
    if (error.isOperational) {
      throw error;
    }

    // Otherwise, convert to AppError
    throw AppError.internal("Payment processing error", "PAYMENT_ERROR");
  }
});

// ============================================
// CHECKLIST FOR MIGRATION
// ============================================

/*
□ Add imports at the top:
  - import { asyncHandler } from "../utils/asyncHandler.js";
  - import AppError from "../utils/AppError.js";

□ Wrap all controller functions with asyncHandler:
  export const myController = asyncHandler(async (req, res) => {
    // code here
  });

□ Remove try-catch blocks (handled by asyncHandler)

□ Replace manual error responses with AppError:
  - Replace res.status(400).json(...) with throw AppError.validation(...)
  - Replace res.status(401).json(...) with throw AppError.authentication(...)
  - Replace res.status(403).json(...) with throw AppError.authorization(...)
  - Replace res.status(404).json(...) with throw AppError.notFound(...)
  - Replace res.status(409).json(...) with throw AppError.conflict(...)

□ For Mongoose operations, let automatic error handling work:
  - ValidationError: Automatically converted to 400
  - CastError: Automatically converted to 400
  - Duplicate key: Automatically converted to 409

□ Use appropriate error codes for client-side handling:
  - Examples: USER_NOT_FOUND, EMAIL_EXISTS, INVALID_CREDENTIALS

□ Test with different error scenarios in Postman/curl

□ Update error messages to be consistent and user-friendly
*/

// ============================================
// EXAMPLE ROUTE HANDLER
// ============================================

/*
// IN YOUR ROUTE FILE:

import { registerUser, updateProfile } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

router.post("/register", registerUser);              // No try-catch needed
router.patch("/profile", authenticate, updateProfile); // Errors handled automatically

// When errors occur, they're caught by asyncHandler and passed to
// the global errorHandler middleware in app.js
*/

export default {
  getUser,
  registerUser,
  updateProfile,
  deleteUser,
  uploadProfileImage,
  createProduct,
  processPayment,
};
