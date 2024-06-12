import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document {
  password: string
  email: string
  active: boolean
  fcm_token: string
  otp: number | undefined
  profile_picture: string | undefined
  role:
    | 'INTERVIEW_CANDIDATE'
    | 'ADMINISTRATOR'
    | 'CAREGIVER'
    | 'RESIDENT'
    | 'HEALTHCARE_PROFESSIONAL'
  email_verification: 'COMPLETED' | 'NOTCOMPLETED' | 'PENDING'
  createdAt: Date
  updatedAt: Date

  // Method to compare passwords
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema(
  {
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    fcm_token: { type: String, required: false },
    otp: { type: Number, required: false, default: undefined },
    profile_picture: { type: String, required: false, default: undefined },
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

userSchema.pre<IUser>('save', function (next) {
  const user = this
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

userSchema.methods.comparePassword = function (
  this: IUser,
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model<IUser>('User', userSchema)

export default User
