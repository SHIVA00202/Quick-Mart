import nodemailer from "nodemailer"
import { createTransport } from "nodemailer";


import dotenv from "dotenv"
dotenv.config()
const sendOtpMail = async (to, otp) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  const html = `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`;
  await transport.sendMail({
    from: process.env.EMAIL,
    to,
    subject:"Reset Your Password",
    html,
  });
};
export default sendOtpMail;


 const sendDeliveryOtpMail =async (user,otp) => {
   const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
   html:`<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
  await transport.sendMail({
    from: process.env.EMAIL,
    to:user.email,
    subject:"Your Delivery OTP ",
    html,
  });
};
export default sendDeliveryOtpMail;

  
  
  
}



