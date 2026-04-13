import nodemailer from "nodemailer";
import env from "../config/env.js";

const emailConfig = {
  // host: env.SMTP_HOST,
  service: "gmail",
  // port: env.NODE_ENV === "development" ? 587 : 465,
  // secure: env.NODE_ENV !== "development", // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  // pool: true,
  // maxConnections: env.SMTP_MAX_CONNECTIONS,
  // maxMessages: env.SMTP_MAX_MESSAGES,
  // rateLimit: env.SMTP_RATE_LIMIT,
  // connectionTimeout: env.SMTP_CONNECTION_TIMEOUT,
  // greetingTimeout: env.SMTP_GREETING_TIMEOUT,
  // socketTimeout: env.SMTP_SOCKET_TIMEOUT,
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport(emailConfig);

    transporter.verify((error) => {
      if (error) {
        console.error("SMTP connection verification failed:", error);
        // Reset so next call retries
        transporter = null;
      } else {
        console.log("SMTP server is ready to send emails");
      }
    });
  }
  return transporter;
};

export { getTransporter };
