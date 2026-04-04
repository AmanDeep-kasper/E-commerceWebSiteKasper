import crypto from "node:crypto";

// SECURITY FIX: Math.random() is NOT cryptographically secure.
// An attacker could predict OTPs if they know the PRNG state.
// Use crypto.randomInt() instead — it uses OS-level CSPRNG.
export const generateOTP = (length = 6) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += crypto.randomInt(0, 10).toString();
  }
  return otp;
};