import mongoose, { Schema, Document, Model } from 'mongoose'
import { IUser } from './UserModel'
import { IDocument } from './DocumentModel'

export interface ICaregiver extends Document {
  userId: mongoose.Schema.Types.ObjectId // Reference to the User model
  contactNumber: string
  address: string
  specialization: string
  licenseNumber: string
  yearsOfExperience: number
  qualifications: string[]
  skills: string[]
  availability: {
    days: string[] // e.g., ["Monday", "Wednesday", "Friday"]
    timeSlots: string[] // e.g., ["09:00-12:00", "13:00-16:00"]
  }
  preferredShifts: string[] // e.g., ["Morning", "Night"]
  workLocationPreferences: string[]
  emergencyContact: {
    name: string
    relationship: string
    phoneNumber: string
  }
  languagesSpoken: string[]
  certifications: string[]
  documents: mongoose.Schema.Types.ObjectId[] // Array of document IDs referencing Document model
  createdAt: Date
  updatedAt: Date
}

const caregiverSchema = new Schema<ICaregiver>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
)

const Caregiver: Model<ICaregiver> = mongoose.model<ICaregiver>(
  'Caregiver',
  caregiverSchema,
)

export default Caregiver
