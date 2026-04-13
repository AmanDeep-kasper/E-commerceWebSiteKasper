// import nodemailer from "nodemailer";
// import env from "../config/env.js";

// const emailConfig = {
//   host: env.SMTP_HOST,
//   port: 587,
//   secure: false,

//   auth: {
//     user: env.SMTP_USER,
//     pass: env.SMTP_PASSWORD,
//   },

//   pool: false,

//   // ✅ FORCE IPv4
//   family: 4,

//   // ✅ timeouts (keep but safe values)
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000,

//   tls: {
//     rejectUnauthorized: false,
//   },
// };

// let transporter = null;

// const getTransporter = () => {
//   if (!transporter) {
//     transporter = nodemailer.createTransport(emailConfig);

//     transporter.verify((error) => {
//       if (error) {
//         console.error("SMTP connection verification failed:", error);
//         // Reset so next call retries
//         transporter = null;
//       } else {
//         console.log("SMTP server is ready to send emails");
//       }
//     });
//   }
//   return transporter;
// };

// export { getTransporter };

import nodemailer from "nodemailer";
import dns from "dns";
import env from "../config/env.js";

// ✅ FORCE IPv4 (VERY IMPORTANT)
dns.setDefaultResultOrder("ipv4first");

let transporter = null;

// ✅ Create transporter (no pooling, stable config)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.SMTP_HOST || "smtp.gmail.com",
    port: 587,
    secure: false, // MUST false for 587

    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },

    // ❌ REMOVE pool (unstable on hotspot)
    pool: false,

    // ✅ FORCE IPv4
    family: 4,

    // ✅ Safe timeouts
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,

    tls: {
      rejectUnauthorized: false,
    },
  });
};

// ✅ Get transporter (lazy init)
export const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};
