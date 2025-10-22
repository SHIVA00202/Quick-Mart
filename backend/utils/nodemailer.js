import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Nodemailer transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: process.env.EMAIL,       // your verified Brevo sender email
    pass: process.env.SMTP_PASS,   // your Brevo SMTP key (NOT your email password)
  },
});

// Send OTP for password reset
export const sendOtpMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject: "Reset Your Password",
      html: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
    console.log("✅ OTP sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send OTP:", err);
    throw err; // Important: lets API know sending failed
  }
};

// Send OTP for delivery
export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Your Delivery OTP",
      html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });
    console.log("✅ Delivery OTP sent:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send delivery OTP:", err);
    throw err;
  }
};
