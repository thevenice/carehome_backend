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
export const paginate = async (
  model: any,
  query: any,
  page: number,
  limit: number,
  populateOptions?: any,
) => {
  const pageNum: number = page || 1
  const limitNum: number = limit || 10

  let resultsQuery = model
    .find(query)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)

  const total = await model.countDocuments(query)

  // Check if 'documents' field exists in the model schema
  const schema = model.schema.obj
  if (schema.hasOwnProperty('documents')) {
    resultsQuery = resultsQuery.populate('documents')
  }

  // Apply additional populate options if provided
  if (populateOptions) {
    resultsQuery = resultsQuery.populate(populateOptions)
  }

  const results = await resultsQuery

  return {
    docs: results,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    total: total,
    limit: limitNum,
  }
}
