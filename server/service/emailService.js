import { transporter } from "../utils/mailer.js";
import env from "../config/env.js";

// REGISTRATION EMAIL OTP
export const sendRegistrationEmail = async (email, otp) => {
  const mailOptions = {
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Your registration OTP for HappyArtSupplies",
    html: `
      <div style="margin:0;padding:0;background:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial;">
        <div style="max-width:600px;margin:40px auto;padding:0 16px;">
          
          <div style="background:#ffffff;border-radius:16px;overflow:hidden;
            box-shadow:0 8px 24px rgba(0,0,0,0.08);">

            <!-- Header -->
            <div style="background:linear-gradient(135deg,#667eea,#764ba2);
              padding:28px;text-align:center;">
              <h2 style="margin:0;color:#fff;font-weight:600;">HappyArtSupplies</h2>
            </div>

            <!-- Content -->
            <div style="padding:32px;">
              <p style="margin:0 0 12px;color:#111827;">Hi,</p>
              
              <p style="color:#4b5563;line-height:1.6;">
                Your registration OTP for HappyArt is
              </p>

              <!-- OTP -->
              <div style="text-align:center;margin:24px 0;">
                <span style="display:inline-block;font-size:32px;
                  letter-spacing:8px;font-weight:700;color:#4f46e5;
                  background:#f3f4f6;padding:14px 26px;border-radius:10px;">
                  ${otp}
                </span>
              </div>

              <p style="color:#4b5563;">
                This OTP is valid for <b>10 minutes</b>.
              </p>

              <p style="color:#6b7280;">
                If you did not request this, please ignore this email.
              </p>
            </div>

            <!-- Footer -->
            <div style="background:#f9fafb;padding:20px;text-align:center;
              border-top:1px solid #e5e7eb;">
              <p style="font-size:12px;color:#9ca3af;margin:0;">
                © ${new Date().getFullYear()} HappyArtSupplies
              </p>
            </div>

          </div>
        </div>
      </div>
    `,
  };

  // const transporter = getTransporter();
  await transporter.sendMail(mailOptions);
};

// PASSWORD RESET EMAIL
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
      <div style="margin:0;padding:0;background:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial;">
        <div style="max-width:600px;margin:40px auto;padding:0 16px;">
          
          <div style="background:#ffffff;border-radius:16px;overflow:hidden;
            box-shadow:0 8px 24px rgba(0,0,0,0.08);">

            <!-- Header -->
            <div style="background:linear-gradient(135deg,#f093fb,#f5576c);
              padding:28px;text-align:center;">
              <h2 style="margin:0;color:#fff;font-weight:600;">HappyArtSupplies</h2>
            </div>

            <!-- Content -->
            <div style="padding:32px;">
              <p style="margin:0 0 12px;color:#111827;">Hi ${name || ""},</p>

              <p style="color:#4b5563;line-height:1.6;">
                You have requested to reset your password for HappyArtSupplies.
              </p>

              <p style="color:#4b5563;">Please click the link below to reset your password:</p>

              <!-- Button -->
              <div style="text-align:center;margin:28px 0;">
                <a href="${resetLink}" target="_blank"
                  style="display:inline-block;background:linear-gradient(135deg,#f093fb,#f5576c);
                  color:#fff;padding:12px 28px;border-radius:8px;
                  text-decoration:none;font-weight:600;">
                  Reset Password
                </a>
              </div>

              <p style="color:#4b5563;">
                This link expires at <b>${expiryString}</b>.
              </p>

              <p style="color:#6b7280;">
                If you did not request this, please ignore this email.
              </p>
            </div>

            <!-- Footer -->
            <div style="background:#f9fafb;padding:20px;text-align:center;
              border-top:1px solid #e5e7eb;">
              <p style="font-size:12px;color:#9ca3af;margin:0;">
                © ${new Date().getFullYear()} HappyArtSupplies
              </p>
            </div>

          </div>
        </div>
      </div>
    `,
  };

  // const transporter = getTransporter();
  await transporter.sendMail(mailOptions);
};

// EMAIL CHANGE OTP
export const sendEmailChangeOTP = async (email, otp, name = "User") => {
  const mailOptions = {
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Confirm Your Email Change - HappyArtSupplies",
    html: `
      <div style="margin:0;padding:0;background:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial;">
        <div style="max-width:600px;margin:40px auto;padding:0 16px;">
          
          <div style="background:#ffffff;border-radius:16px;overflow:hidden;
            box-shadow:0 8px 24px rgba(0,0,0,0.08);">

            <!-- Header -->
            <div style="background:linear-gradient(135deg,#4facfe,#00f2fe);
              padding:28px;text-align:center;">
              <h2 style="margin:0;color:#fff;font-weight:600;">HappyArtSupplies</h2>
            </div>

            <!-- Content -->
            <div style="padding:32px;">
              <p style="color:#111827;">Hi ${name},</p>

              <p style="color:#4b5563;line-height:1.6;">
                We received a request to update the email address associated with your <b>HappyArtSupplies</b> account.
              </p>

              <p style="color:#4b5563;">
                Please use the following One-Time Password (OTP) to confirm this change:
              </p>

              <!-- OTP -->
              <div style="text-align:center;margin:28px 0;">
                <span style="display:inline-block;font-size:34px;
                  letter-spacing:8px;font-weight:700;color:#0284c7;
                  background:#e0f2fe;padding:16px 28px;border-radius:10px;">
                  ${otp}
                </span>
              </div>

              <p style="color:#4b5563;">
                This OTP is valid for <b>10 minutes</b>. Please do not share it with anyone.
              </p>

              <p style="color:#6b7280;">
                If you did not request this change, you can safely ignore this email. Your account will remain secure.
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />

              <p style="font-size:12px;color:#9ca3af;">
                For security reasons, never share your OTP or login credentials with anyone.
              </p>

              <p style="color:#111827;margin-top:20px;">
                Regards,<br/>
                <b>Team HappyArtSupplies</b>
              </p>
            </div>

          </div>
        </div>
      </div>
    `,
  };

  // const transporter = getTransporter();
  await transporter.sendMail(mailOptions);
};

// SUPPORT EMAIL (Professional & Minimal)
export const sendSupportEmail = async (email, name, message, requestId) => {
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: env.SMTP_FROM_EMAIL,
    subject: `Support Request (#${requestId}) - HappyArtSupplies`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
        
        <p>Hello,</p>

        <p>You have received a new support request from a user.</p>

        <p><strong>Request ID:</strong> #${requestId}</p>

        <hr style="margin: 16px 0;" />

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong></p>
        <p style="background:#f9f9f9; padding:12px; border-radius:6px;">
          ${message || "No message provided"}
        </p>

        <br/>

        <p>Regards,<br/>${name}</p>

      </div>
    `,

    text: `
Support Request (#${requestId}) - HappyArtSupplies

Hello,

You have received a new support request.

Name: ${name}
Email: ${email}

Message:
${message || "No message provided"}

Regards,
${name}
    `,
  };

  await transporter.sendMail(mailOptions);
};
