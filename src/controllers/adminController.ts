import { Request, Response } from 'express'
import User, { IUser } from '../models/UserModel'
import {
  companyInfoSchema,
  createUserSchema,
  updateUserSchema,
} from '../utils/adminValidations'
import CompanyInfo from '../models/CompanyInfoModel'
import HealthCareProfessional from '../models/HealthCareProfessionalModel'
import {
  createHealthCareProfessionalSchema,
  updateHealthCareProfessionalSchema,
} from '../utils/healthCareProfessionalSchema'
import {
  createCaregiverSchema,
  updateCaregiverSchema,
} from '../utils/caregiverSchema'
import DocumentModel from '../models/DocumentModel'
import { config, paginate } from '../utils/helper'
import Caregiver from '../models/CaregiverModel'
import mongoose, { Types } from 'mongoose'
import Resident from '../models/ResidentModel'
import {
  createResidentSchema,
  updateResidentSchema,
} from '../utils/residentValidationSchema'
import { createInterviewCandidateSchema, updateInterviewCandidateSchema } from '../utils/InterviewCandidateSchema'
import InterviewCandidateModel from '../models/InterviewCandidateModel'
import InterviewCandidate from '../models/InterviewCandidateModel'
import CarePlan from '../models/CarePlanModel'
import { createCarePlanSchema, updateCarePlanSchema } from '../utils/CarePlanSchema'
import Timesheet from '../models/TimesheetModel'
import Attendance from '../models/AttendanceSheet'
import { createAttendanceSchema, updateAttendanceSchema } from '../utils/attendanceSheet'

export const createDummyAdmin = async (req: Request, res: Response) => {
  try {
    const adminEmail = 'admin@admin.com'

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin already exists' })
    }

    // Create a new admin user for first time and then comment this api
    const adminUser: IUser = new User({
      email: adminEmail,
      password: 'ADMIN@password123!', // Remember to use a strong password in production
      role: 'ADMINISTRATOR',
      email_verification: 'COMPLETED',
    })

    await adminUser.save()

    res.status(201).json({ message: 'Admin created successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin user', error })
  }
}

// Get User or All Users
export const getUser = async (req: Request, res: Response) => {
  const { id, role, active, search_field, search_text } = req.query
  let { page, limit } = req.query

  const _search_field = search_field ? search_field.toString() : ''
  const searchParam = !search_text
    ? ''
    : typeof search_text === 'string'
      ? search_text
      : search_text?.toString()

  try {
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    }

    // Default to all in one page if no pagination params are provided
    if (!page || !limit) {
      options.page = 1
      options.limit = 9999 // large number to get all in one page
    }

    if (id) {
      const user = await User.findById(id)
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' })
      }

      const profile_picturePath = user.profile_picture
        ? `http://localhost:9091/profile_picture/data/${user.profile_picture}`
        : null

      if (profile_picturePath) {
        try {
          return res.status(200).json({
            success: true,
            data: {
              ...user.toObject(), // Convert the Mongoose document to a plain object
              profile_picture: profile_picturePath,
            },
          })
        } catch (err) {
          return res.status(500).json({
            success: false,
            message: 'Error reading profile picture file',
            error: err,
          })
        }
      } else {
        return res.status(200).json({
          success: true,
          data: user.toObject(),
        })
      }
    } else {
      const query: any = {}
      if (role) {
        query.role = role
      }
      if (active) {
        query.active = active
      }

      if (_search_field && search_text) {
        switch (_search_field.toLowerCase()) {
          case 'email':
            query['email'] = { $regex: new RegExp(searchParam, 'i') }
            break
          case 'name':
            query['name'] = { $regex: new RegExp(searchParam, 'i') }
            break
          default:
            return res
              .status(400)
              .json({ success: false, message: 'Invalid search field' })
        }
      }

      const result = await paginate(User, query, options.page, options.limit)

      return res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        limit: result.limit,
      })
    }
  } catch (error) {
    console.error('Error retrieving users', error)
    return res
      .status(500)
      .json({ success: false, message: 'Error retrieving users', error })
  }
}

// Create User
export const createUser = async (req: Request, res: Response) => {
  const { error } = createUserSchema.validate(req.body)
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email })

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' })
    }
    const newUser = new User(req.body)
    if (req.file) newUser.profile_picture = req.file.filename //profile_picture upload through multer
    await newUser.save()
    res.status(201).json({ success: true, data: newUser })
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern.email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' })
    }
    res
      .status(500)
      .json({ success: false, message: 'Error creating user', error })
  }
}

// Update User
export const updateUser = async (req: Request, res: Response) => {
  const { error } = updateUserSchema.validate(req.body)
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })
  }

  try {
    const updateData = req.body
    if (req.file) updateData.profile_picture = req.file.filename //profile_picture upload through multer
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    )
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    res.status(200).json({ success: true, data: updatedUser })
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern.email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already exists' })
    }
    res
      .status(500)
      .json({ success: false, message: 'Error updating user', error })
  }
}

// createOrUpdateCompanyInfo APIs
export const createOrUpdateCompanyInfo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Parse JSON strings in the request body
    ['contactInfo', 'location', 'servicesOffered', 'facilitiesAmenities'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (error) {
          console.error(`Error parsing ${field}:`, error);
        }
      }
    });

    // Handle images array
    if (typeof req.body.images === 'string') {
      try {
        req.body.images = JSON.parse(req.body.images);
      } catch (error) {
        console.error('Error parsing images:', error);
        req.body.images = [];
      }
    }

    // Validate the request body
    const { error } = companyInfoSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const existingCompanyInfo: any = await CompanyInfo.findOne();

    if (existingCompanyInfo) {
      // Update fields that are present in the request body
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined && key !== 'file') { // Skip updating req.file
          existingCompanyInfo[key] = req.body[key];
        }
      });

      // Handle logo update
      if (req.file && typeof(req.file) === 'object') {
        existingCompanyInfo.logo = req.file.filename;
      }
      await existingCompanyInfo.save();
      return res.status(200).json({ success: true, data: existingCompanyInfo });
    }
  } catch (error:any) {
    console.error("Error in createOrUpdateCompanyInfo:", error);
    return res
      .status(500)
      .json({ success: false, message: 'Error saving company info', error: error.message });
  }
};

// getCompanyInfo APIs
export const getCompanyInfo = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const companyInfo = await CompanyInfo.findOne()
    console.log("companyInfo",companyInfo)
    if (!companyInfo) {
      return res
        .status(404)
        .json({ success: false, message: 'Company info not found' })
    }

    // Get the path to the logo file
    const logoPath = companyInfo.logo && !companyInfo.logo.startsWith('http://')
      ? `http://localhost:9091/logo/data/${companyInfo.logo}`
      : companyInfo.logo // Use the existing logo URL if it starts with http://
    console.log('logoPath: ', logoPath)

    if (logoPath) {
      try {
        return res.status(200).json({
          success: true,
          data: {
            ...companyInfo.toObject(), // Convert the Mongoose document to a plain object
            logo: logoPath,
          },
        })
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: 'Error reading logo file',
          error: err,
        })
      }
    } else {
      // If there's no logo path, return the company info without the logo
      return res.status(200).json({
        success: true,
        data: companyInfo.toObject(),
      })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error retrieving company info', error })
  }
}

// Get HealthCareProfessional or All HealthCareProfessionals
export const getHealthCareProfessional = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { userId } = req.query
  let { page, limit } = req.query

  try {
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    }

    // Default to all in one page if no pagination params are provided
    if (!page || !limit) {
      options.page = 1
      options.limit = 9999 // large number to get all in one page
    }

    if (userId) {
      const healthCareProfessional = await HealthCareProfessional.findOne({
        userId: userId,
      }).populate('documents')
      if (!healthCareProfessional) {
        return res
          .status(404)
          .json({ success: false, message: 'HealthCareProfessional not found' })
      }
      return res
        .status(200)
        .json({ success: true, data: healthCareProfessional })
    } else {
      const result = await paginate(
        HealthCareProfessional,
        {},
        options.page,
        options.limit,
      )

      return res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        limit: result.limit,
      })
    }
  } catch (error) {
    console.error('Error retrieving HealthCareProfessionals', error)
    return res.status(500).json({
      success: false,
      message: 'Error retrieving HealthCareProfessionals',
      error,
    })
  }
}

// Create HealthCareProfessional
export const createHealthCareProfessional = async (
  req: Request,
  res: Response,
) => {
  const { error } = createHealthCareProfessionalSchema.validate(req.body)
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })
  }

  const userId = req.body.userId

  try {
    // Check if the user exists
    const userExists = await User.findById(userId)
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist' })
    }
    // Check if the user role is "HEALTHCARE_PROFESSIONAL"
    if (userExists.role !== 'HEALTHCARE_PROFESSIONAL') {
      return res.status(400).json({
        success: false,
        message: 'User role is not healthcare professional',
      })
    }
    // Check if a profile already exists for the user
    const existingProfile = await HealthCareProfessional.findOne({ userId })

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'HealthCareProfessional profile already exists for this user',
      })
    }
    // Create a new HealthCareProfessional profile
    const newHealthCareProfessional = new HealthCareProfessional(req.body)
    await newHealthCareProfessional.save()

    res.status(201).json({ success: true, data: newHealthCareProfessional })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating HealthCareProfessional',
      error,
    })
  }
}

// Update HealthCareProfessional
export const updateHealthCareProfessional = async (
  req: Request,
  res: Response,
) => {
  const { error } = updateHealthCareProfessionalSchema.validate(req.body)
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })
  }

  try {
    const userId = req.params.id
    // Check if the user exists
    const userExists = await User.findById(req.params.id)
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist' })
    }
    // Check if the user role is "HealthCareProfessional"
    if (userExists.role !== 'HEALTHCARE_PROFESSIONAL') {
      return res.status(400).json({
        success: false,
        message: 'User role is not HealthCareProfessional',
      })
    }
    const updatedHealthCareProfessional =
      await HealthCareProfessional.findOneAndUpdate({
        userId: userId,
        ...req.body,
      })
    if (!updatedHealthCareProfessional) {
      // Create a new HealthCareProfessional profile
      const newHealthCareProfessional = new HealthCareProfessional({
        userId: userId,
        ...req.body,
      })
      await newHealthCareProfessional.save()
      return res.status(200).json({ success: true, data: null })
    }
    res.status(200).json({ success: true, data: null })
  } catch (error) {
    console.log('error: ', error)
    res.status(500).json({
      success: false,
      message: 'Error updating HealthCareProfessional',
      error,
    })
  }
}

// Delete HealthCareProfessional
export const deleteHealthCareProfessional = async (
  req: Request,
  res: Response,
) => {
  try {
    const deletedHealthCareProfessional =
      await HealthCareProfessional.findByIdAndDelete(req.params.id)
    if (!deletedHealthCareProfessional) {
      return res
        .status(404)
        .json({ success: false, message: 'HealthCareProfessional not found' })
    }
    res.status(200).json({
      success: true,
      message: 'HealthCareProfessional deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting HealthCareProfessional',
      error,
    })
  }
}

export const getDocuments = async (req: Request, res: Response) => {
  const {
    documentId,
    page = 1,
    limit = 10,
    search_field,
    search_text,
  } = req.query
  const _search_field = search_field ? search_field.toString() : ''
  const searchParam = !search_text
    ? ''
    : typeof search_text === 'string'
      ? search_text
      : search_text?.toString()

  try {
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    }

    if (!page || !limit) {
      options.page = 1
      options.limit = 9999 // large number to get all in one page
    }

    if (documentId) {
      const document = await DocumentModel.findById(documentId)
        .populate('createdBy', 'email name')
        .populate('associatedUsers', 'email name')

      if (!document) {
        return res
          .status(404)
          .json({ success: false, message: 'Document not found' })
      }

      const documentObj = document.toObject()
      const link = documentObj.filename
        ? `http://localhost:9091/documents/data/${documentObj.filename}`
        : null

      //@ts-ignore
      delete documentObj.filename

      return res.status(200).json({
        success: true,
        data: { ...documentObj, link },
      })
    } else {
      let searchQuery: any = {}

      if (_search_field && search_text) {
        switch (_search_field.toLowerCase()) {
          case 'title':
            searchQuery[_search_field] = {
              $regex: new RegExp(searchParam, 'i'),
            }
            break
          case 'createdby.name':
          case 'createdby.email':
          case 'associatedusers.name':
          case 'associatedusers.email':
            break // Handled separately in the aggregation pipeline
          case 'uploadedat':
            searchQuery['uploadedAt'] = { $regex: new RegExp(searchParam, 'i') }
            break
          case 'documentid':
            searchQuery['_id'] = mongoose.Types.ObjectId.isValid(searchParam)
              ? new Types.ObjectId(searchParam)
              : null
            break
          default:
            return res
              .status(400)
              .json({ success: false, message: 'Invalid search field' })
        }
      }

      const aggregateQuery: any[] = [
        { $match: searchQuery },
        {
          $lookup: {
            from: 'users', // Collection name in the database
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'associatedUsers',
            foreignField: '_id',
            as: 'associatedUsers',
          },
        },
      ]

      if (_search_field && search_text) {
        switch (_search_field.toLowerCase()) {
          case 'createdby.name':
            aggregateQuery.push({
              $match: {
                'createdBy.name': { $regex: new RegExp(searchParam, 'i') },
              },
            })
            break
          case 'createdby.email':
            aggregateQuery.push({
              $match: {
                'createdBy.email': { $regex: new RegExp(searchParam, 'i') },
              },
            })
            break
          case 'associatedusers.name':
            aggregateQuery.push({
              $match: {
                'associatedUsers.name': {
                  $regex: new RegExp(searchParam, 'i'),
                },
              },
            })
            break
          case 'associatedusers.email':
            aggregateQuery.push({
              $match: {
                'associatedUsers.email': {
                  $regex: new RegExp(searchParam, 'i'),
                },
              },
            })
            break
        }
      }

      aggregateQuery.push(
        { $skip: (options.page - 1) * options.limit },
        { $limit: options.limit },
      )

      const documents = await DocumentModel.aggregate(aggregateQuery)

      const documentsWithLinks = documents.map((doc: any) => {
        const link = doc.filename
          ? `http://localhost:9091/documents/data/${doc.filename}`
          : null

        //@ts-ignore
        delete doc.filename
        doc.createdBy = doc.createdBy[0]
        return { ...doc, link }
      })

      const totalDocuments = await DocumentModel.countDocuments(searchQuery)
      const totalPages = Math.ceil(totalDocuments / options.limit)

      return res.status(200).json({
        success: true,
        data: documentsWithLinks,
        totalPages,
        currentPage: options.page,
        total: totalDocuments,
        limit: options.limit,
      })
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error retrieving documents', error })
  }
}

// POST /api/documents
export const createDocument = async (req: any, res: Response) => {
  const { title, associatedUsers } = req.body
  const user = req.user

  let filename: string | undefined = req.file?.filename
  try {
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Error creating document',
        error: 'filename not found',
      })
    }
    const newDocument = new DocumentModel({
      title,
      filename,
      createdBy: user.id,
      associatedUsers: associatedUsers || [],
    })
    await newDocument.save()
    const savedDoc = await newDocument.populate('createdBy', 'email name')
    await savedDoc.populate('associatedUsers', 'email name')
    const savedDocObj = savedDoc.toObject()

    const link = savedDocObj.filename
      ? `http://localhost:9091/documents/data/${savedDocObj.filename}`
      : null
    //@ts-ignore
    delete savedDocObj.filename

    res.status(201).json({ success: true, data: { ...savedDocObj, link } })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error creating document', error })
  }
}

// PUT /api/documents/:id
export const updateDocument = async (req: any, res: Response) => {
  const { id } = req.params
  const { title, associatedUsers } = req.body
  const user = req.user

  let filename: string | undefined = req.file?.filename

  try {
    const document = await DocumentModel.findById(id)

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not found' })
    }

    if (document.createdBy.toString() !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this document',
      })
    }

    if (title) {
      document.title = title
    }

    if (filename) {
      document.filename = filename
    }

    if (associatedUsers) {
      document.associatedUsers = associatedUsers
    }

    await document.save()
    await document.populate('createdBy', 'email name')
    await document.populate('associatedUsers', 'email name')
    const updatedDoc = document.toObject()
    const link = updatedDoc.filename
      ? `http://localhost:9091/documents/data/${updatedDoc.filename}`
      : null

    //@ts-ignore
    delete updatedDoc.filename

    res.status(200).json({ success: true, data: { ...updatedDoc, link } })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error updating document', error })
  }
}

// DELETE /api/documents/:id
export const deleteDocument = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const deletedDocument = await DocumentModel.findByIdAndDelete(id)
    if (!deletedDocument) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not found' })
    }
    res
      .status(200)
      .json({ success: true, message: 'Document deleted successfully' })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error deleting document', error })
  }
}

// Post Create Caregiver
export const createCaregiver = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { userId } = req.body

  try {
    const { error } = createCaregiverSchema.validate(req.body)
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message })
    }
    // Check if the user exists
    const userExists = await User.findById(userId)
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist' })
    }
    // Check if the user role is "caregiver"
    if (userExists.role !== 'CAREGIVER') {
      return res
        .status(400)
        .json({ success: false, message: 'User role is not caregiver' })
    }
    // Check if a caregiver profile already exists for the user
    const existingProfile = await Caregiver.findOne({ userId })
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Caregiver profile already exists for this user',
      })
    }

    // Create a new Caregiver profile
    const newCaregiver = new Caregiver(req.body)
    await newCaregiver.save()

    return res.status(201).json({ success: true, data: newCaregiver })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error creating Caregiver', error })
  }
}

// Get Caregiver or All Caregivers
export const getCaregiver = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { userId } = req.query
  const { page = 1, limit = 10 } = req.query

  try {
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    }

    // Default to all in one page if no pagination params are provided
    if (!page || !limit) {
      options.page = 1
      options.limit = 9999 // large number to get all in one page
    }

    if (userId) {
      const caregiver = await Caregiver.findOne({ userId: userId }).populate(
        'documents',
      )
      if (!caregiver) {
        return res
          .status(404)
          .json({ success: false, message: 'Caregiver not found' })
      }
      return res.status(200).json({ success: true, data: caregiver })
    } else {
      const result = await paginate(Caregiver, {}, options.page, options.limit)

      return res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        limit: result.limit,
      })
    }
  } catch (error) {
    console.error('Error retrieving Caregivers', error)
    return res
      .status(500)
      .json({ success: false, message: 'Error retrieving Caregivers', error })
  }
}

// Update a Caregiver by ID
export const updateCaregiverById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { error } = updateCaregiverSchema.validate(req.body)
    const userId = req.params.id

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message })
    }

    // Check if the user exists
    const userExists = await User.findById(userId)
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist' })
    }
    // Check if the user role is "caregiver"
    if (userExists.role !== 'CAREGIVER') {
      return res
        .status(400)
        .json({ success: false, message: 'User role is not caregiver' })
    }
    const caregiver = await Caregiver.findOneAndUpdate({
      userId: userId,
      ...req.body,
    }).populate('documents')
    if (!caregiver) {
      // Create a new Caregiver profile
      const newCaregiver = new Caregiver({
        userId: userId,
        ...req.body,
      })
      await newCaregiver.save()
      return res.status(200).json({ success: true, data: null })
    }
    return res.status(200).json({ success: true, data: null })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error updating Caregiver', error })
  }
}

// Delete a Caregiver by ID
export const deleteCaregiverById = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const caregiver = await Caregiver.findByIdAndDelete(req.params.id)
    if (!caregiver) {
      return res
        .status(404)
        .json({ success: false, message: 'Caregiver not found' })
    }
    return res
      .status(200)
      .json({ success: true, message: 'Caregiver deleted successfully' })
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error deleting Caregiver', error })
  }
}

// Get Resident or All Residents with search functionality
export const getResident = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { userId, search } = req.query
  let { page, limit } = req.query

  try {
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    }

    // Default to all in one page if no pagination params are provided
    if (!page || !limit) {
      options.page = 1
      options.limit = 9999 // large number to get all in one page
    }

    if (userId) {
      const resident = await Resident.findOne({ userId: userId }).populate(
        'documents',
      )
      if (!resident) {
        return res
          .status(404)
          .json({ success: false, message: 'Resident not found' })
      }
      return res.status(200).json({ success: true, data: resident })
    } else {
      let query = {}

      if (search) {
        query = {
          $or: [
            { 'userId.name': { $regex: search, $options: 'i' } },
            { roomNumber: { $regex: search, $options: 'i' } },
            { 'userId.email': { $regex: search, $options: 'i' } },
            { primaryDiagnosis: { $regex: search, $options: 'i' } },
            { secondaryDiagnoses: { $regex: search, $options: 'i' } },
          ],
        }
      }

      const result = await paginate(
        Resident,
        query,
        options.page,
        options.limit,
        { path: 'userId', select: 'name email' },
      )

      return res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        limit: result.limit,
      })
    }
  } catch (error) {
    console.error('Error retrieving Residents', error)
    return res.status(500).json({
      success: false,
      message: 'Error retrieving Residents',
      error,
    })
  }
}

// Create Resident
export const createResident = async (req: Request, res: Response) => {
  const { error } = createResidentSchema.validate(req.body)
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })
  }

  const userId = req.body.userId

  try {
    // Check if the user exists
    const userExists = await User.findById(userId)
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist' })
    }
    // Check if the user role is "RESIDENT"
    if (userExists.role !== 'RESIDENT') {
      return res.status(400).json({
        success: false,
        message: 'User role is not resident',
      })
    }
    // Check if a profile already exists for the user
    const existingProfile = await Resident.findOne({ userId })

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Resident profile already exists for this user',
      })
    }
    // Create a new Resident profile
    const newResident = new Resident(req.body)
    await newResident.save()

    res.status(201).json({ success: true, data: newResident })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating Resident',
      error,
    })
  }
}

// Update Resident
export const updateResident = async (req: Request, res: Response) => {
  const { error } = updateResidentSchema.validate(req.body)
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })
  }

  try {
    const userId = req.params.id
    // Check if the user exists
    const userExists = await User.findById(req.params.id)
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist' })
    }
    // Check if the user role is "RESIDENT"
    if (userExists.role !== 'RESIDENT') {
      return res.status(400).json({
        success: false,
        message: 'User role is not Resident',
      })
    }
    const updatedResident = await Resident.findOneAndUpdate(
      {
        userId: userId,
      },
      req.body,
      { new: true },
    )

    if (!updatedResident) {
      // Create a new Resident profile
      const newResident = new Resident({
        userId: userId,
        ...req.body,
      })
      await newResident.save()
      return res.status(200).json({ success: true, data: newResident })
    }
    res.status(200).json({ success: true, data: updatedResident })
  } catch (error) {
    console.log('error: ', error)
    res.status(500).json({
      success: false,
      message: 'Error updating Resident',
      error,
    })
  }
}

// Delete Resident
export const deleteResident = async (req: Request, res: Response) => {
  try {
    const deletedResident = await Resident.findByIdAndDelete(req.params.id)
    if (!deletedResident) {
      return res
        .status(404)
        .json({ success: false, message: 'Resident not found' })
    }
    res.status(200).json({
      success: true,
      message: 'Resident deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting Resident',
      error,
    })
  }
}

// Get InterviewCandidate or All InterviewCandidates with search functionality
export const getInterviewCandidate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId, search } = req.query
  let { page, limit } = req.query

  try {
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    }

    // Default to all in one page if no pagination params are provided
    if (!page || !limit) {
      options.page = 1
      options.limit = 9999 // large number to get all in one page
    }

    if (userId) {
      const candidate = await InterviewCandidate.findOne({ userId: userId })
      if (!candidate) {
        return res
          .status(404)
          .json({ success: false, message: 'Interview candidate not found' })
      }
      return res.status(200).json({ success: true, data: candidate })
    } else {
      let query = {}

      if (search) {
        query = {
          $or: [
            { 'userId.name': { $regex: search, $options: 'i' } },
            { 'userId.email': { $regex: search, $options: 'i' } },
            { desiredPosition: { $regex: search, $options: 'i' } },
            { skills: { $regex: search, $options: 'i' } },
            { qualifications: { $regex: search, $options: 'i' } },
          ],
        }
      }

      const result = await paginate(
        InterviewCandidate,
        query,
        options.page,
        options.limit,
        { path: 'userId', select: 'name email' }
      )

      return res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        limit: result.limit,
      })
    }
  } catch (error) {
    console.error('Error retrieving Interview Candidates', error)
    return res.status(500).json({
      success: false,
      message: 'Error retrieving Interview Candidates',
      error,
    })
  }
}

// Create InterviewCandidate
export const createInterviewCandidate = async (req: Request, res: Response) => {
  const { error } = createInterviewCandidateSchema.validate(req.body)
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })
  }

  const userId = req.body.userId

  try {
    // Check if the user exists
    const userExists = await User.findById(userId)
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist' })
    }
    // Check if the user role is "CANDIDATE"
    if (userExists.role !== 'INTERVIEW_CANDIDATE') {
      return res.status(400).json({
        success: false,
        message: 'User role is not candidate',
      })
    }
    // Check if a profile already exists for the user
    const existingProfile = await InterviewCandidateModel.findOne({ userId })

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Interview candidate profile already exists for this user',
      })
    }

    let filename: string | undefined = req.file?.filename
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Error creating document',
        error: 'Reupload Resume file',
      })
    }
    const resumeUrl = filename
    ? `http://localhost:9091/documents/data/${filename}`
    : null
    
    const reqData = req.body
    reqData.resumeUrl = resumeUrl

    // Create a new InterviewCandidate profile
    const newCandidate = new InterviewCandidate(reqData)
    await newCandidate.save()

    res.status(201).json({ success: true, data: newCandidate })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating Interview Candidate',
      error,
    })
  }
}

// Update InterviewCandidate
export const updateInterviewCandidate = async (req: Request, res: Response) => {
  const { error } = updateInterviewCandidateSchema.validate(req.body)
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })
  }

  try {
    const userId = req.params.id
    // Check if the user exists
    const userExists = await User.findById(req.params.id)
    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User does not exist' })
    }
    // Check if the user role is "CANDIDATE"
    if (userExists.role !== 'INTERVIEW_CANDIDATE') {
      return res.status(400).json({
        success: false,
        message: 'User role is not Candidate',
      })
    }
    let filename: string | undefined = req.file?.filename
    if (req.file){
      if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Error creating document',
        error: 'Reupload Resume file',
      })
    }}
    const resumeUrl = filename
    ? `http://localhost:9091/documents/data/${filename}`
    : null
    
    const reqData = req.body
    reqData.resumeUrl = resumeUrl

    const updatedCandidate = await InterviewCandidateModel.findOneAndUpdate(
      {
        userId: userId,
      },
      reqData,
      { new: true },
    )

    if (!updatedCandidate) {
      // Create a new InterviewCandidate profile
      const newCandidate = new InterviewCandidateModel({
        userId: userId,
        ...req.body,
      })
      await newCandidate.save()
      return res.status(200).json({ success: true, data: newCandidate })
    }
    res.status(200).json({ success: true, data: updatedCandidate })
  } catch (error) {
    console.log('error: ', error)
    res.status(500).json({
      success: false,
      message: 'Error updating Interview Candidate',
      error,
    })
  }
}

// Delete InterviewCandidate
export const deleteInterviewCandidate = async (req: Request, res: Response) => {
  try {
    const deletedCandidate = await InterviewCandidateModel.findByIdAndDelete(req.params.id)
    if (!deletedCandidate) {
      return res
        .status(404)
        .json({ success: false, message: 'Interview Candidate not found' })
    }
    res.status(200).json({
      success: true,
      message: 'Interview Candidate deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting Interview Candidate',
      error,
    })
  }
}

// Get CarePlan or All CarePlans with search functionality

export const getCarePlan = async (req: Request, res: Response): Promise<Response> => {
  const { id, search } = req.query;
  let { page, limit } = req.query;

  try {
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    // Default to all in one page if no pagination params are provided
    if (!page || !limit) {
      options.page = 1;
      options.limit = 9999; // large number to get all in one page
    }

    const formatLink = (path: string | null | undefined, type: 'pdf' | 'image'): string | null => {
      if (!path) return null;
      const filename = path.split('/').pop();
      if (type === 'pdf') {
        return `${config.serverUrl}/care-plan-pdfs/data/${filename}`;
      } else {
        return `${config.serverUrl}/care-plan-images/data/${filename}`;
      }
    };
  
    const formatCarePlan = (plan: any) => {
      return {
        ...plan.toObject(),
        planPdfLink: formatLink(plan.planPdfLink, 'pdf'),
        featuredImageLink: formatLink(plan.featuredImageLink, 'image'),
        mediaLinks: plan.mediaLinks ? plan.mediaLinks.map((link: string) => formatLink(link, 'image')) : [],
      };
    };

    if (id) {
      const carePlan = await CarePlan.findById(id);
      if (!carePlan) {
        return res.status(404).json({ success: false, message: 'Care plan not found' });
      }
      return res.status(200).json({ success: true, data: formatCarePlan(carePlan) });
    } else {
      let query: any = {};

      if (search) {
        query = {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { level: { $regex: search, $options: 'i' } },
            { specializedCare: { $regex: search, $options: 'i' } },
          ],
        };
      }

      const result = await paginate(
        CarePlan,
        query,
        options.page,
        options.limit
      );

      const formattedDocs = result.docs.map(formatCarePlan);

      return res.status(200).json({
        success: true,
        data: formattedDocs,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        limit: result.limit,
      });
    }
  } catch (error) {
    console.error('Error retrieving Care Plans', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving Care Plans',
      error,
    });
  }
};

// Create CarePlan
export const createCarePlan = async (req: Request, res: Response) => {
  console.log('req.body:', req.body);
  console.log('req.body.data:', req.body.data);
  console.log('typeof req.body.data:', typeof req.body.data);

  let dataToValidate;
  
  try {
    if (typeof req.body.data === 'string') {
      dataToValidate = JSON.parse(req.body.data);
    } else if (typeof req.body.data === 'object') {
      dataToValidate = req.body.data;
    } else {
      return res.status(400).json({ success: false, message: "Invalid data format" });
    }
  } catch (err) {
    return res.status(400).json({ success: false, message: "Error parsing data" });
  }

  const { error } = createCarePlanSchema.validate(dataToValidate);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const dataToSave: any = dataToValidate;
    
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files['planPdf']) {
        dataToSave.planPdfLink = `/uploads/pdfs/${files['planPdf'][0].filename}`;
      }
      
      if (files['featuredImage']) {
        dataToSave.featuredImageLink = `/uploads/images/${files['featuredImage'][0].filename}`;
      }
      
      if (files['mediaImages']) {
        dataToSave.mediaLinks = files['mediaImages'].map(file => `/uploads/images/${file.filename}`);
      }
      console.log(dataToSave.planPdfLink)
      console.log(dataToSave.featuredImageLink)
    }

    const newCarePlan = new CarePlan(dataToSave);
    await newCarePlan.save();

    res.status(201).json({ success: true, data: newCarePlan });
  } catch (error:any) {
    console.error('Error creating Care Plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Care Plan',
      error: error.message,
    });
  }
};

export const updateCarePlan = async (req: Request, res: Response) => {
  const { error } = updateCarePlanSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const planId = req.params.id;

    // Check if the plan exists
    const existingPlan = await CarePlan.findById(planId);
    if (!existingPlan) {
      return res.status(404).json({ success: false, message: 'Care plan does not exist' });
    }

    const updateData: any = req.body;

    // Handle file uploads
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files['planPdf']) {
        updateData.planPdfLink = `/uploads/pdfs/${files['planPdf'][0].filename}`;
      }

      if (files['featuredImage']) {
        updateData.featuredImageLink = `/uploads/images/${files['featuredImage'][0].filename}`;
      }

      if (files['mediaImages']) {
        // Append new media links to existing ones
        const newMediaLinks = files['mediaImages'].map(file => `/uploads/images/${file.filename}`);
        updateData.mediaLinks = [...(existingPlan.mediaLinks || []), ...newMediaLinks];
      }
    }

    // Update the care plan
    const updatedPlan = await CarePlan.findByIdAndUpdate(planId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlan) {
      return res.status(404).json({ success: false, message: 'Care plan not found' });
    }

    res.status(200).json({ success: true, data: updatedPlan });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating Care Plan',
      error,
    });
  }
};

// Delete CarePlan
export const deleteCarePlan = async (req: Request, res: Response) => {
  try {
    const carePlanId = req.params.id
    const deletedCarePlan = await CarePlan.findByIdAndDelete(carePlanId)

    if (!deletedCarePlan) {
      return res.status(404).json({ success: false, message: 'Care plan not found' })
    }

    res.status(200).json({ success: true, message: 'Care plan deleted successfully' })
  } catch (error) {
    console.log('error: ', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting Care Plan',
      error,
    })
  }
}

// GET /api/timesheets
export const getTimesheets = async (req: Request, res: Response) => {
  const {
    timesheetId,
    page = 1,
    limit = 10,
    search_field,
    search_text,
  } = req.query;
  const _search_field = search_field ? search_field.toString() : '';
  const searchParam = !search_text
    ? ''
    : typeof search_text === 'string'
    ? search_text
    : search_text?.toString();

  try {
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    if (!page || !limit) {
      options.page = 1;
      options.limit = 9999; // large number to get all in one page
    }

    if (timesheetId) {
      const timesheet = await Timesheet.findById(timesheetId).populate('user', 'email name');

      if (!timesheet) {
        return res.status(404).json({ success: false, message: 'Timesheet not found' });
      }

      return res.status(200).json({
        success: true,
        data: timesheet,
      });
    } else {
      let searchQuery: any = {};

      if (_search_field && search_text) {
        switch (_search_field.toLowerCase()) {
          case 'date':
            searchQuery[_search_field] = { $regex: new RegExp(searchParam, 'i') };
            break;
          case 'status':
            searchQuery[_search_field] = { $regex: new RegExp(searchParam, 'i') };
            break;
          case 'user.name':
          case 'user.email':
            break; // Handled separately in the aggregation pipeline
          default:
            return res.status(400).json({ success: false, message: 'Invalid search field' });
        }
      }

      const aggregateQuery: any[] = [
        { $match: searchQuery },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
      ];

      if (_search_field && search_text) {
        switch (_search_field.toLowerCase()) {
          case 'user.name':
            aggregateQuery.push({
              $match: { 'user.name': { $regex: new RegExp(searchParam, 'i') } },
            });
            break;
          case 'user.email':
            aggregateQuery.push({
              $match: { 'user.email': { $regex: new RegExp(searchParam, 'i') } },
            });
            break;
        }
      }

      aggregateQuery.push(
        { $skip: (options.page - 1) * options.limit },
        { $limit: options.limit }
      );

      const timesheets = await Timesheet.aggregate(aggregateQuery);

      const timesheetsWithUserData = timesheets.map((timesheet: any) => {
        timesheet.user = timesheet.user[0];
        return timesheet;
      });

      const totalTimesheets = await Timesheet.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalTimesheets / options.limit);

      return res.status(200).json({
        success: true,
        data: timesheetsWithUserData,
        totalPages,
        currentPage: options.page,
        total: totalTimesheets,
        limit: options.limit,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving timesheets', error });
  }
};

// POST /api/timesheets
export const createTimesheet = async (req: any, res: Response) => {
  const { date, shiftStart, shiftEnd, breakTime, totalHours, status, notes } = req.body;
  const user = req.user;

  try {
    const newTimesheet = new Timesheet({
      user: user.id,
      date,
      shiftStart,
      shiftEnd,
      breakTime,
      totalHours,
      status,
      notes,
    });

    await newTimesheet.save();
    const savedTimesheet = await newTimesheet.populate('user', 'email name');

    res.status(201).json({ success: true, data: savedTimesheet });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating timesheet', error });
  }
};

// PUT /api/timesheets/:id
export const updateTimesheet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const timesheet = await Timesheet.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'email name');

    if (!timesheet) {
      return res.status(404).json({ success: false, message: 'Timesheet not found' });
    }

    res.status(200).json({ success: true, data: timesheet });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating timesheet', error });
  }
};

export const updateTimesheetStatus = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const adminId = req?.user.id; 

  try {
    // Check if the user is an admin
    const admin = await User.findById(adminId);
    if (!admin || admin?.role !== 'ADMINISTRATOR') {
      return res.status(403).json({ success: false, message: 'Unauthorized: Admin access required' });
    }

    // Validate the status
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const timesheet = await Timesheet.findById(id);
    if (!timesheet) {
      return res.status(404).json({ success: false, message: 'Timesheet not found' });
    }

    // Update the timesheet
    timesheet.status = status;
    timesheet.notes = notes || timesheet.notes;
    timesheet.statusUpdatedBy = adminId;

    await timesheet.save();

    // Populate user information
    await timesheet.populate('user', 'email name');
    await timesheet.populate('statusUpdatedBy', 'email name');

    res.status(200).json({ success: true, data: timesheet });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating timesheet status', error });
  }
};

// DELETE /api/timesheets/:id
export const deleteTimesheet = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const timesheet = await Timesheet.findByIdAndDelete(id);

    if (!timesheet) {
      return res.status(404).json({ success: false, message: 'Timesheet not found' });
    }

    res.status(200).json({ success: true, message: 'Timesheet deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting timesheet', error });
  }
};


// GET /api/attendance
export const getAttendance = async (req: Request, res: Response) => {
  const {
    attendanceId,
    page = 1,
    limit = 10,
    search_field,
    search_text,
  } = req.query;
  const _search_field = search_field ? search_field.toString() : '';
  const searchParam = !search_text
    ? ''
    : typeof search_text === 'string'
    ? search_text
    : search_text?.toString();

  try {
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    if (!page || !limit) {
      options.page = 1;
      options.limit = 9999; // large number to get all in one page
    }

    if (attendanceId) {
      const attendance = await Attendance.findById(attendanceId).populate('user', 'email name');

      if (!attendance) {
        return res.status(404).json({ success: false, message: 'Attendance record not found' });
      }

      return res.status(200).json({
        success: true,
        data: attendance,
      });
    } else {
      let searchQuery: any = {};

      if (_search_field && search_text) {
        switch (_search_field.toLowerCase()) {
          case 'date':
            searchQuery[_search_field] = { $regex: new RegExp(searchParam, 'i') };
            break;
          case 'status':
            searchQuery[_search_field] = { $regex: new RegExp(searchParam, 'i') };
            break;
          case 'user.name':
          case 'user.email':
            break; // Handled separately in the aggregation pipeline
          default:
            return res.status(400).json({ success: false, message: 'Invalid search field' });
        }
      }

      const aggregateQuery: any[] = [
        { $match: searchQuery },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
      ];

      if (_search_field && search_text) {
        switch (_search_field.toLowerCase()) {
          case 'user.name':
            aggregateQuery.push({
              $match: { 'user.name': { $regex: new RegExp(searchParam, 'i') } },
            });
            break;
          case 'user.email':
            aggregateQuery.push({
              $match: { 'user.email': { $regex: new RegExp(searchParam, 'i') } },
            });
            break;
        }
      }

      aggregateQuery.push(
        { $skip: (options.page - 1) * options.limit },
        { $limit: options.limit }
      );

      const attendanceRecords = await Attendance.aggregate(aggregateQuery);

      const attendanceWithUserData = attendanceRecords.map((record: any) => {
        record.user = record.user[0];
        return record;
      });

      const totalRecords = await Attendance.countDocuments(searchQuery);
      const totalPages = Math.ceil(totalRecords / options.limit);

      return res.status(200).json({
        success: true,
        data: attendanceWithUserData,
        totalPages,
        currentPage: options.page,
        total: totalRecords,
        limit: options.limit,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving attendance records', error });
  }
};

// POST /api/attendance
export const createAttendance = async (req: any, res: Response) => {
  try {
  const { error, value } = createAttendanceSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  const { date, checkIn, checkOut, status, notes } = req.body;
  const user = req.user;
    const newAttendance = new Attendance({
      user: user.id,
      date,
      checkIn,
      checkOut,
      status,
      notes,
    });

    await newAttendance.save();
    const savedAttendance = await newAttendance.populate('user', 'email name');

    res.status(201).json({ success: true, data: savedAttendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating attendance record', error });
  }
};

// PUT /api/attendance/:id
export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const { error, value } = updateAttendanceSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    const { id } = req.params;
    const updateData = req.body;
    const attendance = await Attendance.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'email name');

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating attendance record', error });
  }
};

// DELETE /api/attendance/:id
export const deleteAttendance = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.status(200).json({ success: true, message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting attendance record', error });
  }
};