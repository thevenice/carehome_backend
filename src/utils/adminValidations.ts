import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  active: Joi.boolean().optional(),
  fcm_token: Joi.string().optional(),
  otp: Joi.number().optional(),
  role: Joi.string().valid('INTERVIEW_CANDIDATE', 'ADMINISTRATOR', 'CAREGIVER', 'RESIDENT', 'HEALTHCARE_PROFESSIONAL').default('INTERVIEW_CANDIDATE'),
  email_verification: Joi.string().valid('COMPLETED', 'NOTCOMPLETED', 'PENDING').default('PENDING')
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  active: Joi.boolean().optional(),
  fcm_token: Joi.string().optional(),
  otp: Joi.number().optional(),
  role: Joi.string().valid('INTERVIEW_CANDIDATE', 'ADMINISTRATOR', 'CAREGIVER', 'RESIDENT', 'HEALTHCARE_PROFESSIONAL').optional(),
  email_verification: Joi.string().valid('COMPLETED', 'NOTCOMPLETED', 'PENDING').optional()
});

export const companyInfoSchema = Joi.object({
  name: Joi.string().required(),
  contactInfo: Joi.object({
    phoneNumber: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
  }).required(),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      type: Joi.string().valid('Point').required(),
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
    }).required(),
  }).required(),
  images: Joi.array().items(Joi.string().uri()),
  aboutUs: Joi.string().optional(),
  servicesOffered: Joi.array().items(Joi.string()).optional(),
  facilitiesAmenities: Joi.string().optional(),
  testimonials: Joi.array().items(Joi.string()).optional(),
});
