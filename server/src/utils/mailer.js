import nodemailer from "nodemailer";
import env from "../config/env.js";

let transporter = null;

console.log("user", env.SMTP_USER);
console.log("pass", env.SMTP_PASSWORD);

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail", // ✅ simple & stable
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD, // 🔥 MUST be App Password
      },
    });

    console.log("📩 Transporter initialized");
  }

  return transporter;
};

export { getTransporter };
