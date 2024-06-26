import Joi from 'joi';

const careNoteSchema = Joi.object({
    _id: Joi.string().optional(),
    date: Joi.date().required(),
    note: Joi.string().required(),
    author: Joi.string().required(), // This should be a valid ObjectId string
  });

const emergencyContactSchema = Joi.object({
  _id: Joi.string().optional(),
  name: Joi.string().required(),
  relationship: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
});

const medicationSchema = Joi.object({
  _id: Joi.string().optional(),
  name: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional(),
});

const baseResidentSchema = {
  userId: Joi.string().required(),
  admissionDate: Joi.date().required(),
  roomNumber: Joi.string().required(),
  careLevel: Joi.string().required(),
  primaryDiagnosis: Joi.string().required(),
  secondaryDiagnoses: Joi.array().items(Joi.string()),
  allergies: Joi.array().items(Joi.string()),
  dietaryRestrictions: Joi.array().items(Joi.string()),
  medications: Joi.array().items(medicationSchema),
  mobilityStatus: Joi.string().required(),
  assistiveDevices: Joi.array().items(Joi.string()),
  dnrStatus: Joi.boolean().required(),
  emergencyContacts: Joi.array().items(emergencyContactSchema),
  primaryPhysician: Joi.object({
    name: Joi.string().required(),
    contactNumber: Joi.string().required(),
  }),
  insuranceInfo: Joi.object({
    provider: Joi.string().required(),
    policyNumber: Joi.string().required(),
  }),
  legalGuardian: Joi.object({
    name: Joi.string(),
    relationship: Joi.string(),
    contactNumber: Joi.string(),
    email: Joi.string().email(),
  }).optional(),
  preferences: Joi.object({
    wakeUpTime: Joi.string(),
    bedTime: Joi.string(),
    mealPreferences: Joi.array().items(Joi.string()),
    activities: Joi.array().items(Joi.string()),
  }),
  documents: Joi.array().items(Joi.string()),
  careNotes: Joi.array().items(careNoteSchema),
};

export const createResidentSchema = Joi.object({
  ...baseResidentSchema,
});

export const updateResidentSchema = Joi.object({
  ...baseResidentSchema,
}).fork(Object.keys(baseResidentSchema), (schema) => schema.optional());