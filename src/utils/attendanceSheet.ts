import Joi from 'joi'

export const createAttendanceSchema = Joi.object({
  date: Joi.date().iso().required(),
  checkIn: Joi.date().iso().optional(),
  checkOut: Joi.date().iso().optional(),
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'EARLY_DEPARTURE').required(),
  notes: Joi.string().allow('').optional(),
})

export const updateAttendanceSchema = Joi.object({
  date: Joi.date().iso().optional(),
  checkIn: Joi.date().iso().optional(),
  checkOut: Joi.date().iso().optional(),
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE', 'EARLY_DEPARTURE').optional(),
  notes: Joi.string().allow('').optional(),
}).min(1) // Ensure at least one field is being updated