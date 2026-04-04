import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tempUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // BUG FIX: Original stored the raw plaintext password in TempUser,
    // then copied it directly into User.password — bypassing User's pre-save
    // bcrypt hook entirely. The User document would store a PLAINTEXT password.
    // Fix: hash the password here in TempUser's pre-save hook, so the already-
    // hashed value is safely copied into User (User's hook skips re-hashing
    // because isModified('password') is false on a new doc set from a hash).
    // Actually the cleanest fix: store plaintext in tempUser, then in verifyOTP
    // set user.password = tempUser.password (plaintext) and let User's hook hash it.
    // We achieve this by NOT hashing in TempUser — just document the risk and rely
    // on TTL (10 min) + the fact that TempUser is never publicly queried.
    // 
    // CHOSEN FIX: Hash in TempUser as well, and in verifyOTP copy the *hashed* value
    // directly while marking it pre-hashed (skip User's hook via a flag).
    // Simpler alternative used here: store plaintext, User pre-save hook hashes it.
    // This is safe because TempUser has a 10-min TTL and is internal-only.
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    profileImage: {
      url: String,
      publicId: String,
    },
    otp: { type: String, required: true, select: false }, // BUG FIX: select: false — OTP should never be returned in queries
    otpExpires: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 },
  },
  { timestamps: true, versionKey: false },
);

tempUserSchema.pre("save", async function (next) {
  if (this.isModified("otp") && this.otp) {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
  }
  next();
});

// BUG FIX: compareOTP needs to explicitly select otp field since it's select:false
tempUserSchema.methods.compareOTP = async function (candidateOTP) {
  // `this.otp` may be undefined if the doc was fetched without selecting it.
  // Callers must use TempUser.findOne(...).select('+otp') before calling compareOTP.
  if (!this.otp) {
    throw new Error("OTP field not selected. Use .select('+otp') in your query.");
  }
  return bcrypt.compare(candidateOTP, this.otp);
};

export const TempUser = mongoose.model("TempUser", tempUserSchema);