import Joi from "joi"

export const createTimesheetSchema = Joi.object({
    date: Joi.date().iso().required(),
    shiftStart: Joi.date().iso().required(),
    shiftEnd: Joi.date().iso().required(),
    breakTime: Joi.number().min(0).required(),
    totalHours: Joi.number().min(0).required(),
    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').required(),
    notes: Joi.string().allow('').optional(),
  })
  
  export const updateTimesheetSchema = Joi.object({
    date: Joi.date().iso().optional(),
    shiftStart: Joi.date().iso().optional(),
    shiftEnd: Joi.date().iso().optional(),
    breakTime: Joi.number().min(0).optional(),
    totalHours: Joi.number().min(0).optional(),
    status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').optional(),
    notes: Joi.string().allow('').optional(),
  }).min(1) // Ensure at least one field is being updated