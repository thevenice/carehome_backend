import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer/lib/smtp-transport'

const transporter = nodemailer.createTransport(
  new smtpTransport({
    host: process.env.MAIL_HOST,
    // secureConnection: false,
    tls: {
      rejectUnauthorized: false,
    },
    port: 587,
    auth: {
      user: process.env.EMAIL_SEND_SESSION,
      pass: process.env.EMAIL_SEND_PASSWORD,
    },
  }),
)

// Reusable function to send OTP to user's email
export const sendOTP = async (email: string, otp: number) => {
  const mailOptions = {
    from: process.env.EMAIL_SEND_SESSION,
    to: email,
    subject: 'OTP for Email Verification',
    text: `Your OTP is: ${otp}`,
  }

  await transporter.sendMail(mailOptions)
}

// Function to generate a random OTP
export function generateOTP(): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  return otp
  // return '098765'
}
