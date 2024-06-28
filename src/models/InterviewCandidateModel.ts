import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import User, { IUser } from './UserModel'

export interface IInterviewCandidate extends Document {
  userId: Types.ObjectId
  contactNumber: string
  address: string
  desiredPosition: string
  yearsOfExperience: number
  qualifications: string[]
  skills: string[]
  availability: {
    days: string[]
    timeSlots: string[]
  }
  preferredWorkSchedule: string[]
  locationPreferences: string[]
  emergencyContact: {
    name: string
    relationship: string
    phoneNumber: string
  }
  languagesSpoken: string[]
  certifications: string[]
  resumeUrl: string
  currentEmploymentStatus: string
  expectedSalary: number
  noticePeriod: number
  interviewAvailability: Date[]
  references: {
    name: string
    company: string
    position: string
    contactInfo: string
  }[]
}

const interviewCandidateSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    desiredPosition: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    qualifications: {
      type: [String],
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    availability: {
      days: {
        type: [String],
        required: true,
      },
      timeSlots: {
        type: [String],
        required: true,
      },
    },
    preferredWorkSchedule: {
      type: [String],
      required: true,
    },
    locationPreferences: {
      type: [String],
      required: true,
    },
    emergencyContact: {
      name: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
    languagesSpoken: {
      type: [String],
      required: true,
    },
    certifications: {
      type: [String],
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    currentEmploymentStatus: {
      type: String,
      required: true,
    },
    expectedSalary: {
      type: Number,
      required: true,
    },
    noticePeriod: {
      type: Number,
      required: true,
    },
    interviewAvailability: {
      type: [Date],
      required: true,
    },
    references: [
      {
        name: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        position: {
          type: String,
          required: true,
        },
        contactInfo: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

const InterviewCandidate: Model<IInterviewCandidate> = mongoose.model<IInterviewCandidate>(
  'InterviewCandidate',
  interviewCandidateSchema,
)

export default InterviewCandidate