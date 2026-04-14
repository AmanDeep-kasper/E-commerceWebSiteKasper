import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const getTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) throw new Error("EMAIL_USER or EMAIL_PASS is missing");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.NODE_ENV === "production" ? 465 : 587,
    secure: process.env.NODE_ENV === "production" ? true : false,

    auth: {
      user,
      pass,
    },
  });

  return transporter;
};

export { getTransporter };
