import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) throw new Error("EMAIL_USER or EMAIL_PASS is missing");

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.NODE_ENV === "production" ? 465 : 587,
    secure: env.NODE_ENV === "production" ? true : false,

    auth: {
      user,
      pass,
    },
  });

  return transporter;
};

export { getTransporter };
