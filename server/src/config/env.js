import dotenv from "dotenv";
dotenv.config();

const required = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "FRONTEND_URL",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM_EMAIL",
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

export default {
  PORT: process.env.PORT || 5000,

  MONGO_URI: process.env.MONGO_URI,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || "3m",
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "7d",

  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,

  ENABLE_DEVICE_FINGERPRINT: process.env.ENABLE_DEVICE_FINGERPRINT === "true",
  FRONTEND_URL: process.env.FRONTEND_URL,

  CORS_ORIGIN: process.env.CORS_ORIGIN,

  NODE_ENV: process.env.NODE_ENV || "development",

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,

  SMTP_MAX_CONNECTIONS: parseInt(process.env.SMTP_MAX_CONNECTIONS || "5"),
  SMTP_MAX_MESSAGES: parseInt(process.env.SMTP_MAX_MESSAGES || "100"),
  SMTP_RATE_LIMIT: parseInt(process.env.SMTP_RATE_LIMIT || "0"),

  SMTP_CONNECTION_TIMEOUT: parseInt(
    process.env.SMTP_CONNECTION_TIMEOUT || "10000",
  ),
  SMTP_GREETING_TIMEOUT: parseInt(process.env.SMTP_GREETING_TIMEOUT || "10000"),
  SMTP_SOCKET_TIMEOUT: parseInt(process.env.SMTP_SOCKET_TIMEOUT || "30000"),

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  RAZORPAY_API_KEY: process.env.RAZORPAY_API_KEY,
  RAZORPAY_API_SECRET: process.env.RAZORPAY_API_SECRET,

  // Production RSA keys
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  PUBLIC_KEY: process.env.PUBLIC_KEY,

  REDIS_URL: process.env.REDIS_URL,

  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_NAME: process.env.ADMIN_NAME,
};
