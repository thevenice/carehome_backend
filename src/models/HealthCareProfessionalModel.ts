import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import DocumentModel, { IDocument } from './DocumentModel'
import User, { IUser } from './UserModel'

export interface IHealthCareProfessional extends Document {
  userId: Types.ObjectId
  contactNumber: string
  address: string
  specialization: string
  licenseNumber: string
  yearsOfExperience: number
  qualifications: string[]
  skills: string[]
  availability: {
    days: string[]
    timeSlots: string[]
  }
  preferredShifts: string[]
  workLocationPreferences: string[]
  emergencyContact: {
    name: string
    relationship: string
    phoneNumber: string
  }
  languagesSpoken: string[]
  certifications: string[]
  documents: Types.ObjectId[]
}

const healthCareProfessionalSchema = new Schema(
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
    specialization: {
      type: String,
      required: true,
    },
    licenseNumber: {
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
    preferredShifts: {
      type: [String],
      required: true,
    },
    workLocationPreferences: {
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
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  },
)

const HealthCareProfessional: Model<IHealthCareProfessional> =
  mongoose.model<IHealthCareProfessional>(
    'HealthCareProfessional',
    healthCareProfessionalSchema,
  )

export default HealthCareProfessional
