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

  await transporter.sendMail(mailOptions);
};

export const sendShippingConfirmationEmail = async (
  email,
  name,
  orderId,
  productDetails,
) => {
  const mailOptions = {
    from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: `Your order #${orderId} is on its way! 🚚`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 40px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
                    <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px; letter-spacing: -0.5px;">Your Order Has Shipped!</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 0; line-height: 1.5;">Great news, ${name} — your package is on the way!</p>
                  </td>
                </tr>

                <!-- Order Info -->
                <tr>
                  <td style="padding: 40px 40px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; padding: 24px;">
                      <tr>
                        <td>
                          <p style="color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Order Number</p>
                          <p style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0; letter-spacing: -0.3px;">#${orderId}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Products Section -->
                <tr>
                  <td style="padding: 32px 40px 40px;">
                    <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin: 0 0 20px; letter-spacing: -0.3px;">Items in Your Shipment</h2>
                    
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                      ${productDetails
                        .map(
                          (product, index) => `
                        <tr>
                          <td style="padding: 16px 0; ${index !== productDetails.length - 1 ? "border-bottom: 1px solid #e2e8f0;" : ""}">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td width="48" style="vertical-align: top; padding-right: 16px;">
                                  <div style="width: 48px; height: 48px; background-color: #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                    📱
                                  </div>
                                </td>
                                <td style="vertical-align: top;">
                                  <p style="color: #1e293b; font-size: 15px; font-weight: 600; margin: 0 0 4px;">${product.name || "Product"}</p>
                                  <p style="color: #64748b; font-size: 13px; margin: 0; line-height: 1.5;">
                                    ${product.variant ? `Variant: ${product.variant} · ` : ""}
                                    Qty: ${product.quantity || 1}
                                  </p>
                                </td>
                                <td style="vertical-align: top; text-align: right;">
                                  <p style="color: #1e293b; font-size: 15px; font-weight: 700; margin: 0; white-space: nowrap;">${product.price || ""}</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      `,
                        )
                        .join("")}
                    </table>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td style="padding: 0 40px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="background-color: #6366f1; border-radius: 12px; padding: 16px 32px;">
                          <a href="${env.FRONTEND_URL || "#"}/orders/${orderId}" style="color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; display: block; letter-spacing: -0.2px;">Track Your Package →</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
                      Questions about your order? Simply reply to this email or contact our support team.
                    </p>
                    <p style="color: #cbd5e1; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} ${env.COMPANY_NAME || "Company Name"}. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
