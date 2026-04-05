import { getTransporter } from "../utils/mailer.js";
import env from "../config/env.js";

export const sendRegistrationEmail = async (email, otp) => {
  const mailOptions = {
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Your registration OTP for HappyArtSupplies",
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
    subject: "Password Reset Request for HappyArtSupplies",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <p>Hi ${name || ""},</p>
        <p>You have requested to reset your password for HappyArtSupplies.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
        <p>This link expires at <b>${expiryString}</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>`,
  };

  const transporter = getTransporter();
  await transporter.sendMail(mailOptions);
};