import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import CarePlanAddon, {ICarePlanAddon} from './CarePlanAddonModel'
export interface ICarePlan extends Document {
  name: string
  description: string
  level: 'Basic' | 'Standard' | 'Premium' | 'Custom'
  monthlyPrice: number
  features: string[]
  services: Array<{
    name: string
    description: string
    frequency: string
  }>
  accommodationType: 'Shared Room' | 'Private Room' | 'Suite'
  mealPlanIncluded: boolean
  activitiesIncluded: boolean
  specializedCare: string[]
  staffingRatio: string
  // availableAddOns: Array<Types.ObjectId>
  minimumStayPeriod: number // in months
  cancellationPolicy: string
  isActive: boolean
  featuredImageLink: string  // New field
  mediaLinks: string[]       // New field
  planPdfLink: string        // New field
  
}

const carePlanSchema = new Schema(
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
    level: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium', 'Custom'],
      required: true,
    },
    monthlyPrice: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    services: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
      },
    ],
    accommodationType: {
      type: String,
      enum: ['Shared Room', 'Private Room', 'Suite'],
      required: true,
    },
    mealPlanIncluded: {
      type: Boolean,
      default: true,
    },
    activitiesIncluded: {
      type: Boolean,
      default: true,
    },
    specializedCare: {
      type: [String],
      default: [],
    },
    staffingRatio: {
      type: String,
      required: true,
    },
    // availableAddOns: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'CarePlanAddon',
    //     required: true,
    //   },
    // ],
    minimumStayPeriod: {
      type: Number,
      default: 1,
    },
    cancellationPolicy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featuredImageLink: {
        type: String,
        required: true,
      },
      mediaLinks: {
        type: [String],
        default: [],
      },
      planPdfLink: {
        type: String,
        required: true,
      },
  },
  {
    timestamps: true,
  },
)

const CarePlan: Model<ICarePlan> = mongoose.model<ICarePlan>(
  'CarePlan',
  carePlanSchema,
)

export default CarePlan
