import mongoose, { Schema, Document } from 'mongoose'
//@ts-ignore
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  password: string
  email: string
  active: boolean
  fcm_token: string
  otp: number | undefined
  role:
    | 'INTERVIEW_CANDIDATE'
    | 'ADMINISTRATOR'
    | 'CAREGIVER'
    | 'RESIDENT'
    | 'HEALTHCARE_PROFESSIONAL'
  email_verification: 'COMPLETED' | 'NOTCOMPLETED' | 'PENDING'
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema(
  {
    password: { type: String, required: true },
    email: { type: String, required: true },
    active: { type: Boolean, default: true },
    fcm_token: { type: String, required: false },
    otp: { type: Number, required: false, default: undefined },
    role: {
      type: String,
      enum: [
        'INTERVIEW_CANDIDATE',
        'ADMINISTRATOR',
        'CAREGIVER',
        'RESIDENT',
        'HEALTHCARE_PROFESSIONAL',
      ],
      required: false,
      default: 'INTERVIEW_CANDIDATE',
    },
    email_verification: {
      type: String,
      enum: ['COMPLETED', 'NOTCOMPLETED', 'PENDING'],
      required: true,
      default: 'PENDING',
    },
  },
  {
    timestamps: true, // This option enables Mongoose to automatically manage createdAt and updatedAt fields
  },
)

userSchema.pre('save', function (next) {
  const user = this as IUser
  if (!user.isModified('password')) {
    return next()
  }

  bcrypt.hash(
    user.password,
    10,
    (err: mongoose.CallbackError | undefined, hash: string) => {
      if (err) return next(err)
      user.password = hash
      next()
    },
  )
})

userSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model<IUser>('User', userSchema)
