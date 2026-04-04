import { getTransporter } from "../utils/mailer.js";
import env from "../config/env.js";

// BUG FIX 1: Original used callback-style sendMail — errors were silently swallowed
// (only logged) and the caller had no way to know if the email failed.
// Fix: use the promise-based API (sendMail returns a promise when no callback is passed)
// and always throw so callers can handle failures.

// BUG FIX 2: Original sendPasswordResetEmail signature was (email, resetLink) but
// authController called it as (email, name, resetLink, tokenExpiry) — argument mismatch
// caused resetLink to receive `name` and the actual link was never embedded in the email.

// BUG FIX 3: from: used env.EMAIL_USER which does not exist in env config.
// The correct key is env.SMTP_FROM_EMAIL.

export const sendRegistrationEmail = async (email, otp) => {
  const mailOptions = {
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Your registration OTP for HappyArt",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <p>Hi,</p>
        <p>Your registration OTP for HappyArt is <strong>${otp}</strong>.</p>
        <p>This OTP is valid for <b>10 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>`,
  };

  const transporter = getTransporter();
  // Let exceptions propagate — callers (registerUser) wrap in try/catch
  await transporter.sendMail(mailOptions);
};

// FIXED signature: (email, name, resetLink, tokenExpiry)
export const sendPasswordResetEmail = async (
  email,
  name,
  resetLink,
  tokenExpiry,
) => {
  const expiryString = tokenExpiry
    ? new Date(tokenExpiry).toLocaleTimeString()
    : "10 minutes";

  const mailOptions = {
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Password Reset Request for HappyArt",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <p>Hi ${name || ""},</p>
        <p>You have requested to reset your password for HappyArt.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
        <p>This link expires at <b>${expiryString}</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>`,
  };

  const transporter = getTransporter();
  await transporter.sendMail(mailOptions);
};