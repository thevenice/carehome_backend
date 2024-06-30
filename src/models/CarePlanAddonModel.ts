import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICarePlanAddon extends Document {
  name: string
  description: string
  category: 'Care' | 'Amenity' | 'Therapy' | 'Recreation' | 'Other'
  price: {
    amount: number
    frequency: 'One-time' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
  }
  availability: 'Always' | 'Limited' | 'Seasonal'
  requiresAssessment: boolean
  staffingRequirement: string
  duration: {
    value: number
    unit: 'Days' | 'Weeks' | 'Months' | 'Ongoing'
  }
  maxCapacity: number // Maximum number of residents who can use this addon simultaneously
  isActive: boolean
}

const carePlanAddonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Care', 'Amenity', 'Therapy', 'Recreation', 'Other'],
      required: true,
    },
    price: {
      amount: {
        type: Number,
        required: true,
      },
      frequency: {
        type: String,
        enum: ['One-time', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
        required: true,
      },
    },
    availability: {
      type: String,
      enum: ['Always', 'Limited', 'Seasonal'],
      default: 'Always',
    },
    requiresAssessment: {
      type: Boolean,
      default: false,
    },
    staffingRequirement: {
      type: String,
    },
    duration: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ['Days', 'Weeks', 'Months', 'Ongoing'],
        required: true,
      },
    },
    maxCapacity: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const CarePlanAddon: Model<ICarePlanAddon> = mongoose.model<ICarePlanAddon>(
  'CarePlanAddon',
  carePlanAddonSchema
)

export default CarePlanAddon