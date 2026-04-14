import nodemailer from "nodemailer";
import env from "../config/env.js";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

const user = env.SMTP_USER;
const pass = env.SMTP_PASSWORD;

if (!user || !pass) {
  console.log("SMTP_USER or SMTP_PASSWORD is missing");
  return;
}

console.log(user, pass);

const emailConfig = {
  host: env.SMTP_HOST,
  port: env.NODE_ENV === "production" ? 465 : 587,
  secure: env.NODE_ENV === "production" ? true : false,

  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },

  family: 4,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
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
