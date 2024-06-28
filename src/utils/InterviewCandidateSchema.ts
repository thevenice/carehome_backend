import Joi from 'joi'

export const createInterviewCandidateSchema = Joi.object({
  userId: Joi.string().required(),
  contactNumber: Joi.string().required(),
  address: Joi.string().required(),
  desiredPosition: Joi.string().required(),
  yearsOfExperience: Joi.number().required(),
  qualifications: Joi.array().items(Joi.string()).required(),
  skills: Joi.array().items(Joi.string()).required(),
  availability: Joi.object({
    days: Joi.array().items(Joi.string()).required(),
    timeSlots: Joi.array().items(Joi.string()).required(),
  }).required(),
  preferredWorkSchedule: Joi.array().items(Joi.string()).required(),
  locationPreferences: Joi.array().items(Joi.string()).required(),
  emergencyContact: Joi.object({
    name: Joi.string().required(),
    relationship: Joi.string().required(),
    phoneNumber: Joi.string().required(),
  }).required(),
  languagesSpoken: Joi.array().items(Joi.string()).required(),
  certifications: Joi.array().items(Joi.string()).required(),
  resumeUrl: Joi.string().uri().optional(),
  currentEmploymentStatus: Joi.string().required(),
  expectedSalary: Joi.number().required(),
  noticePeriod: Joi.number().required(),
  interviewAvailability: Joi.array().items(Joi.date()).required(),
  references: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    company: Joi.string().required(),
    position: Joi.string().required(),
    contactInfo: Joi.string().required(),
  })).required(),
})

export const updateInterviewCandidateSchema = Joi.object({
  contactNumber: Joi.string().optional(),
  address: Joi.string().optional(),
  desiredPosition: Joi.string().optional(),
  yearsOfExperience: Joi.number().optional(),
  qualifications: Joi.array().items(Joi.string()).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  availability: Joi.object({
    days: Joi.array().items(Joi.string()).optional(),
    timeSlots: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  preferredWorkSchedule: Joi.array().items(Joi.string()).optional(),
  locationPreferences: Joi.array().items(Joi.string()).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().optional(),
    relationship: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
  }).optional(),
  languagesSpoken: Joi.array().items(Joi.string()).optional(),
  certifications: Joi.array().items(Joi.string()).optional(),
  resumeUrl: Joi.string().uri().optional(),
  currentEmploymentStatus: Joi.string().optional(),
  expectedSalary: Joi.number().optional(),
  noticePeriod: Joi.number().optional(),
  interviewAvailability: Joi.array().items(Joi.date()).optional(),
  references: Joi.array().items(Joi.object({
    name: Joi.string().optional(),
    company: Joi.string().optional(),
    position: Joi.string().optional(),
    contactInfo: Joi.string().optional(),
  })).optional(),
})