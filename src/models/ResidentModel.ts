import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import User, { IUser } from './UserModel'
import DocumentModel, { IDocument } from './DocumentModel'

export interface IResident extends Document {
  userId: Types.ObjectId
  admissionDate: Date
  roomNumber: string
  careLevel: string
  primaryDiagnosis: string
  secondaryDiagnoses: string[]
  allergies: string[]
  dietaryRestrictions: string[]
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    startDate: Date
    endDate?: Date
  }>
  mobilityStatus: string
  assistiveDevices: string[]
  dnrStatus: boolean
  emergencyContacts: Array<{
    name: string
    relationship: string
    phoneNumber: string
    email: string
  }>
  primaryPhysician: {
    name: string
    contactNumber: string
  }
  insuranceInfo: {
    provider: string
    policyNumber: string
  }
  legalGuardian?: {
    name: string
    relationship: string
    contactNumber: string
    email: string
  }
  preferences: {
    wakeUpTime: string
    bedTime: string
    mealPreferences: string[]
    activities: string[]
  }
  careNotes: Array<{
    date: Date
    note: string
    author: Types.ObjectId
  }>
  documents: Types.ObjectId[]
}

const residentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admissionDate: {
      type: Date,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    careLevel: {
      type: String,
      required: true,
    },
    primaryDiagnosis: {
      type: String,
      required: true,
    },
    secondaryDiagnoses: {
      type: [String],
      default: [],
    },
    allergies: {
      type: [String],
      default: [],
    },
    dietaryRestrictions: {
      type: [String],
      default: [],
    },
    medications: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
        },
      },
    ],
    mobilityStatus: {
      type: String,
      required: true,
    },
    assistiveDevices: {
      type: [String],
      default: [],
    },
    dnrStatus: {
      type: Boolean,
      required: true,
    },
    emergencyContacts: [
      {
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
        email: {
          type: String,
          required: true,
        },
      },
    ],
    primaryPhysician: {
      name: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
      },
    },
    insuranceInfo: {
      provider: {
        type: String,
        required: true,
      },
      policyNumber: {
        type: String,
        required: true,
      },
    },
    legalGuardian: {
      name: {
        type: String,
      },
      relationship: {
        type: String,
      },
      contactNumber: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    preferences: {
      wakeUpTime: {
        type: String,
      },
      bedTime: {
        type: String,
      },
      mealPreferences: {
        type: [String],
        default: [],
      },
      activities: {
        type: [String],
        default: [],
      },
    },
    careNotes: [
      {
        date: {
          type: Date,
          required: true,
        },
        note: {
          type: String,
          required: true,
        },
        author: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
    documents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
  },
  {
    timestamps: true,
  },
)

const Resident: Model<IResident> = mongoose.model<IResident>(
  'Resident',
  residentSchema,
)

export default Resident
