import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const tempUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true , index: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    role: { type: String, default: "user" },
    otp: { type: String, required: true, select: false },
    otpAttempts: { type: Number, default: 0 },
    lastOtpRequest: { type: Date, default: Date.now },
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

tempUserSchema.methods.compareOTP = async function (candidateOTP) {
  if (!this.otp) {
    throw new Error(
      "OTP field not selected. Use .select('+otp') in your query.",
    );
  }
  return bcrypt.compare(candidateOTP, this.otp);
};

const TempUser = mongoose.model("TempUser", tempUserSchema);
export default TempUser;
