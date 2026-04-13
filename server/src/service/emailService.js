import { getTransporter } from "../utils/mailer.js";
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

  const transporter = getTransporter();
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

  const transporter = getTransporter();
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

  const transporter = getTransporter();
  await transporter.sendMail(mailOptions);
};

// SUPPORT EMAIL
export const sendSupportEmail = async (email, name, message, requestId) => {
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: env.SMTP_FROM_EMAIL,
    subject: "Support Request - HappyArtSupplies",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Support Request</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background-color: #f5f7fa;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
          }
          .container {
            max-width: 560px;
            margin: 40px auto;
            padding: 0 20px;
          }
          .card {
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          .header {
            padding: 32px 32px 0 32px;
          }
          .logo {
            font-size: 24px;
            font-weight: 600;
            color: #1a1a2e;
            letter-spacing: -0.5px;
          }
          .logo span {
            color: #e8794b;
          }
          .title {
            font-size: 28px;
            font-weight: 600;
            color: #1a1a2e;
            margin-top: 24px;
            letter-spacing: -0.5px;
          }
          .divider {
            height: 4px;
            width: 48px;
            background: #e8794b;
            margin: 16px 0 24px 0;
            border-radius: 2px;
          }
          .content {
            padding: 0 32px 32px 32px;
          }
          .info-grid {
            background: #f8fafc;
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 28px;
            border: 1px solid #eef2f6;
          }
          .info-row {
            margin-bottom: 16px;
          }
          .info-row:last-child {
            margin-bottom: 0;
          }
          .info-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #64748b;
            margin-bottom: 6px;
          }
          .info-value {
            font-size: 16px;
            font-weight: 500;
            color: #0f172a;
            word-break: break-word;
          }
          .message-section {
            margin-top: 8px;
          }
          .message-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #64748b;
            margin-bottom: 12px;
          }
          .message-box {
            background: #fafcff;
            border: 1px solid #eef2f6;
            border-radius: 18px;
            padding: 20px;
            font-size: 15px;
            line-height: 1.6;
            color: #1e293b;
            white-space: pre-wrap;
            word-break: break-word;
          }
          .badge {
            display: inline-block;
            background: #fef3c7;
            color: #d97706;
            font-size: 12px;
            font-weight: 500;
            padding: 4px 12px;
            border-radius: 30px;
            margin-top: 24px;
          }
          .footer {
            background: #fafcfc;
            padding: 20px 32px;
            border-top: 1px solid #eef2f6;
            text-align: center;
          }
          .footer-text {
            font-size: 12px;
            color: #94a3b8;
          }
          .footer-text a {
            color: #e8794b;
            text-decoration: none;
          }
          @media (max-width: 480px) {
            .container {
              margin: 20px auto;
            }
            .header {
              padding: 24px 24px 0 24px;
            }
            .content {
              padding: 0 24px 24px 24px;
            }
            .title {
              font-size: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <div class="logo">HappyArt<span>Supplies</span></div>
              <h1 class="title">New Support Request</h1>
              <div class="divider"></div>
            </div>
            
            <div class="content">
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-label">From</div>
                  <div class="info-value">${name}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Email</div>
                  <div class="info-value">${email}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Request ID</div>
                  <div class="info-value">#${requestId}</div>
                </div>
              </div>
              
              <div class="message-section">
                <div class="message-label">Message</div>
                <div class="message-box">
                  ${message || "<em>No message provided</em>"}
                </div>
              </div>
              
              <div class="badge">
                ⚡ Response expected within 24 hours
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-text">
                HappyArtSupplies • <a href="#">support@happyartsupplies.com</a>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NEW SUPPORT REQUEST - HAPPYARTSUPPLIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FROM: ${name}
EMAIL: ${email}
REQUEST ID: #${requestId}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MESSAGE:
${message || "No message provided"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Response expected within 24 hours
HappyArtSupplies Support
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `,
  };

  const transporter = getTransporter();
  await transporter.sendMail(mailOptions);
};
