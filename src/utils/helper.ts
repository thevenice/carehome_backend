import nodemailer from 'nodemailer'

// Nodemailer setup
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
})

// Reusable function to send OTP to user's email
export const sendOTP = async (email: string, otp: number) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'OTP for Email Verification',
    text: `Your OTP is: ${otp}`,
  }

  // await transporter.sendMail(mailOptions);
}

// Function to generate a random OTP
export function generateOTP(): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  // return otp;
  return '098765'
}
