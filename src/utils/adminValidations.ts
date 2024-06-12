import Joi from 'joi'

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  active: Joi.boolean().optional(),
  fcm_token: Joi.string().optional(),
  otp: Joi.number().optional(),
  role: Joi.string()
    .valid(
      'INTERVIEW_CANDIDATE',
      'ADMINISTRATOR',
      'CAREGIVER',
      'RESIDENT',
      'HEALTHCARE_PROFESSIONAL',
    )
    .default('INTERVIEW_CANDIDATE'),
  email_verification: Joi.string()
    .valid('COMPLETED', 'NOTCOMPLETED', 'PENDING')
    .default('PENDING'),
})

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  active: Joi.boolean().optional(),
  fcm_token: Joi.string().optional(),
  otp: Joi.number().optional(),
  role: Joi.string()
    .valid(
      'INTERVIEW_CANDIDATE',
      'ADMINISTRATOR',
      'CAREGIVER',
      'RESIDENT',
      'HEALTHCARE_PROFESSIONAL',
    )
    .optional(),
  email_verification: Joi.string()
    .valid('COMPLETED', 'NOTCOMPLETED', 'PENDING')
    .optional(),
})

export const companyInfoSchema = Joi.object({
  name: Joi.string().required(),
  contactInfo: Joi.string().required(),
  location: Joi.object({
    address: Joi.string().optional(),
    coordinates: Joi.object({
      type: Joi.string().valid('Point').optional(),
      coordinates: Joi.array().items(Joi.number()).length(2).optional(),
    }).optional(),
  }).optional(),
  logo: Joi.string().optional(),
  linkedin: Joi.string().optional(),
  googleMap: Joi.string().optional(),
  xCom: Joi.string().optional(),
  instagram: Joi.string().optional(),
  facebook: Joi.string().optional(),
  whatsapp: Joi.string().optional(),
  telegram: Joi.string().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  aboutUs: Joi.string().optional(),
  servicesOffered: Joi.string().optional(),
  facilitiesAmenities: Joi.string().optional(),
})
