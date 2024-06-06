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