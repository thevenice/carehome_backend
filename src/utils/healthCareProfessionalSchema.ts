import Joi from 'joi';

export const createHealthCareProfessionalSchema = Joi.object({
  userId: Joi.string().required(),
  contactNumber: Joi.string().required(),
  address: Joi.string().required(),
  specialization: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  yearsOfExperience: Joi.number().required(),
  qualifications: Joi.array().items(Joi.string()).required(),
  skills: Joi.array().items(Joi.string()).required(),
  availability: Joi.object({
    days: Joi.array().items(Joi.string()).required(),
    timeSlots: Joi.array().items(Joi.string()).required()
  }).required(),
  preferredShifts: Joi.array().items(Joi.string()).required(),
  workLocationPreferences: Joi.array().items(Joi.string()).required(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    relationship: Joi.string().required(),
    phoneNumber: Joi.string().required()
  }).required(),
  languagesSpoken: Joi.array().items(Joi.string()).required(),
  certifications: Joi.array().items(Joi.string()).required(),
  documents: Joi.array().items(Joi.string()).required(),
});

export const updateHealthCareProfessionalSchema = Joi.object({
  contactNumber: Joi.string().optional(),
  address: Joi.string().optional(),
  specialization: Joi.string().optional(),
  licenseNumber: Joi.string().optional(),
  yearsOfExperience: Joi.number().optional(),
  qualifications: Joi.array().items(Joi.string()).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  availability: Joi.object({
    days: Joi.array().items(Joi.string()).optional(),
    timeSlots: Joi.array().items(Joi.string()).optional()
  }).optional(),
  preferredShifts: Joi.array().items(Joi.string()).optional(),
  workLocationPreferences: Joi.array().items(Joi.string()).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().optional(),
    relationship: Joi.string().optional(),
    phoneNumber: Joi.string().optional()
  }).optional(),
  languagesSpoken: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional(),
  documents: Joi.array().items(Joi.string()).optional(),
});
