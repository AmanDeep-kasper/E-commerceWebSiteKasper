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

export const sendEmailChangeOTP = async (email, otp, name = "User") => {
  const mailOptions = {
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Confirm Your Email Change - HappyArtSupplies",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          
          <h2 style="margin-top: 0; color: #2c3e50;">Email Change Verification</h2>
          
          <p style="color: #333;">Hi ${name},</p>
          
          <p style="color: #555;">
            We received a request to update the email address associated with your <b>HappyArtSupplies</b> account.
          </p>
          
          <p style="color: #555;">
            Please use the following One-Time Password (OTP) to confirm this change:
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #2d89ef; background: #f0f6ff; padding: 12px 24px; border-radius: 6px;">
              ${otp}
            </span>
          </div>

          <p style="color: #555;">
            This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.
          </p>

          <p style="color: #555;">
            If you did not request this change, you can safely ignore this email. Your account will remain secure.
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

          <p style="font-size: 12px; color: #999;">
            For security reasons, never share your OTP or login credentials with anyone.
          </p>

          <p style="color: #333; margin-top: 20px;">
            Regards,<br/>
            <b>Team HappyArtSupplies</b>
          </p>
        
        </div>

      </div>
    `,
  };

  const transporter = getTransporter();
  await transporter.sendMail(mailOptions);
};
