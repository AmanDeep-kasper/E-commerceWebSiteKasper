import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      match: [
        /^[a-zA-Z\s'-]+$/,
        "Name can only contain letters, spaces, hyphens, and apostrophes",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    phoneNumber: {
      type: String,
      sparse: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid phone number"],
    },

    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    points: {
      type: Number,
      default: 0,
    },

    pointsExpireAt: Date,

    totalOrders: {
      type: Number,
      default: 0,
    },

    totalSpend: {
      type: Number,
      default: 0,
    },

    lastOrderAt: Date,

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      lowercase: true,
      index: true,
    },

    profileImage: {
      publicId: String,
      url: String,
    },

    dateOfBirth: { type: Date },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    resetPasswordToken: {
      type: String,
      index: true,
      select: false,
    },
    resetPasswordExpires: { type: Date, select: false },
    resetPasswordAttempts: { type: Number, default: 0, min: 0 },
    lastResetRequest: { type: Date },
    lastResetRequestIP: { type: String },
    lastResetRequestDevice: { type: String },
    lastPasswordChange: { type: Date },
    lastPasswordChangeIP: { type: String },
    lastPasswordChangeDevice: { type: String },

    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0, min: 0 },
    lockUntil: { type: Date },
    lastLoginDevice: { type: String },
    lastLoginIP: { type: String },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    refreshTokens: [
      {
        tokenId: String,
        sessionId: String,
        token: String,
        createdAt: Date,
        expiresAt: Date,
        isRevoked: { type: Boolean, default: false },
        deviceInfo: {
          userAgent: String,
          ipAddress: String,
          platform: String,
          fingerprint: String,
        },
      },
    ],

    activeSessions: {
      type: [String],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ email: 1, isVerified: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ resetPasswordToken: 1, resetPasswordExpires: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.incrementLoginAttempts = async function () {
  if (this.lockUntil && this.lockUntil < new Date()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: new Date(Date.now() + 5 * 60 * 1000) };
  }

  return await this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

userSchema.methods.updateLastLogin = async function () {
  return await this.updateOne({ $set: { lastLogin: new Date() } });
};

const User = mongoose.model("User", userSchema);
export default User;
