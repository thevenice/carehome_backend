import Joi from 'joi'

// Schema for creating a new care plan
export const createCarePlanSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  level: Joi.string().valid('Basic', 'Standard', 'Premium', 'Custom').required(),
  monthlyPrice: Joi.number().positive().required(),
  features: Joi.array().items(Joi.string()),
  services: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      frequency: Joi.string().required(),
    })
  ),
  accommodationType: Joi.string().valid('Shared Room', 'Private Room', 'Suite').required(),
  mealPlanIncluded: Joi.boolean(),
  activitiesIncluded: Joi.boolean(),
  specializedCare: Joi.array().items(Joi.string()),
  staffingRatio: Joi.string().required(),
  // availableAddOns: Joi.array().items(Joi.string()), // Assuming these are IDs of CarePlanAddons
  minimumStayPeriod: Joi.number().integer().min(1),
  cancellationPolicy: Joi.string().required(),
  isActive: Joi.boolean(),
})

// Schema for updating an existing care plan
export const updateCarePlanSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  level: Joi.string().valid('Basic', 'Standard', 'Premium', 'Custom'),
  monthlyPrice: Joi.number().positive(),
  features: Joi.array().items(Joi.string()),
  services: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      frequency: Joi.string().required(),
    })
  ),
  accommodationType: Joi.string().valid('Shared Room', 'Private Room', 'Suite'),
  mealPlanIncluded: Joi.boolean(),
  activitiesIncluded: Joi.boolean(),
  specializedCare: Joi.array().items(Joi.string()),
  staffingRatio: Joi.string(),  minimumStayPeriod: Joi.number().integer().min(1),
  cancellationPolicy: Joi.string(),
  isActive: Joi.boolean(),
  documentUrl: Joi.string().uri(),
}).min(1) // Ensure at least one field is being updated