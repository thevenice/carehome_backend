import { Request, Response } from 'express'
import User, { IUser } from '../models/UserModel'
import {
  companyInfoSchema,
  createUserSchema,
  updateUserSchema,
} from '../utils/adminValidations'
import CompanyInfo from '../models/CompanyInfoModel'
import HealthCareProfessional from '../models/HealthCareProfessionalModel'
import { createHealthCareProfessionalSchema, updateHealthCareProfessionalSchema } from '../utils/healthCareProfessionalSchema'
import DocumentModel from '../models/DocumentModel'
import { paginate } from '../utils/helper'
import Caregiver from '../models/CaregiverModel'

export const createDummyAdmin = async (req: Request, res: Response) => {
  try {
    const adminEmail = 'admin@admin.com'

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin already exists' })
    }

    // Create a new admin user
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
  const { id } = req.query;
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

    if (id) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Get the path to the logo file
      const profile_picturePath = user.profile_picture
        ? `http://localhost:9091/profile_picture/data/${user.profile_picture}`
        : null;

      if (profile_picturePath) {
        try {
          return res.status(200).json({
            success: true,
            data: {
              ...user.toObject(), // Convert the Mongoose document to a plain object
              profile_picture: profile_picturePath,
            },
          });
        } catch (err) {
          return res.status(500).json({
            success: false,
            message: 'Error reading logo file',
            error: err,
          });
        }
      } else {
        // If there's no logo path, return the user info without the logo
        return res.status(200).json({
          success: true,
          data: user.toObject(),
        });
      }
    } else {
      const result = await paginate(User, {}, options.page, options.limit);
      return res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        limit: result.limit
      });
    }
  } catch (error) {
    console.error('Error retrieving users', error);
    return res.status(500).json({ success: false, message: 'Error retrieving users', error });
  }
};

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
// Company APIs
export const createOrUpdateCompanyInfo = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { error } = companyInfoSchema.validate(req.body)
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message })
  }

  try {
    const existingCompanyInfo = await CompanyInfo.findOne()

    if (existingCompanyInfo) {
      // Update only the fields that are present in the request body
      if (req.body.name) existingCompanyInfo.name = req.body.name
      if (req.body.contactInfo) {
        const contactInfoJson = JSON.parse(req.body.contactInfo)
        existingCompanyInfo.contactInfo = contactInfoJson
      }
      if (req.body.servicesOffered) {
        const servicesOfferedJson = JSON.parse(req.body.servicesOffered)
        existingCompanyInfo.servicesOffered = servicesOfferedJson
      }
      if (req.body.facilitiesAmenities) {
        const facilitiesAmenitiesJson = JSON.parse(req.body.facilitiesAmenities)
        existingCompanyInfo.facilitiesAmenities = facilitiesAmenitiesJson
      }

      if (req.body.location) existingCompanyInfo.location = req.body.location
      if (req.body.images) existingCompanyInfo.images = req.body.images
      if (req.body.aboutUs) existingCompanyInfo.aboutUs = req.body.aboutUs
      if (req.body.testimonials)
        existingCompanyInfo.testimonials = req.body.testimonials
      if (req.body.linkedin) existingCompanyInfo.linkedin = req.body.linkedin
      if (req.body.googleMap) existingCompanyInfo.googleMap = req.body.googleMap
      if (req.body.xCom) existingCompanyInfo.xCom = req.body.xCom
      if (req.body.instagram) existingCompanyInfo.instagram = req.body.instagram
      if (req.body.facebook) existingCompanyInfo.facebook = req.body.facebook
      if (req.body.whatsapp) existingCompanyInfo.whatsapp = req.body.whatsapp
      if (req.body.telegram) existingCompanyInfo.telegram = req.body.telegram
      if (req.file) existingCompanyInfo.logo = req.file.filename //logo upload through multer

      await existingCompanyInfo.save()
      return res.status(200).json({ success: true, data: existingCompanyInfo })
    } else {
      const dataJson = req.body
      if (dataJson.contactInfo) {
        const contactInfoData = JSON.parse(dataJson.contactInfo)
        dataJson.contactInfo = contactInfoData
      }
      if (dataJson.servicesOffered) {
        const servicesOfferedData = JSON.parse(dataJson.servicesOffered)
        dataJson.servicesOffered = servicesOfferedData
      }
      if (dataJson.facilitiesAmenities) {
        const facilitiesAmenitiesData = JSON.parse(dataJson.facilitiesAmenities)
        dataJson.facilitiesAmenities = facilitiesAmenitiesData
      }
      const newCompanyInfo = new CompanyInfo(dataJson)

      if (req.file) newCompanyInfo.logo = req.file.path //logo upload through multer

      await newCompanyInfo.save()
      return res.status(201).json({ success: true, data: newCompanyInfo })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error saving company info', error })
  }
}

export const getCompanyInfo = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const companyInfo = await CompanyInfo.findOne()
    if (!companyInfo) {
      return res
        .status(404)
        .json({ success: false, message: 'Company info not found' })
    }

    // Get the path to the logo file
    const logoPath = companyInfo.logo
      ? `http://localhost:9091/logo/data/${companyInfo.logo}`
      : null
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
        return res
          .status(500)
          .json({
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
// HealthCareProfessional APIs

// Get HealthCareProfessional or All HealthCareProfessionals
export const getHealthCareProfessional = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.query;
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

    if (userId) {
      const healthCareProfessional = await HealthCareProfessional.findOne({ userId: userId }).populate('documents');
      if (!healthCareProfessional) {
        return res.status(404).json({ success: false, message: 'HealthCareProfessional not found' });
      }
      return res.status(200).json({ success: true, data: healthCareProfessional });
    } else {
      const result = await paginate(HealthCareProfessional, {}, options.page, options.limit);

      return res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        limit: result.limit
      });
    }
  } catch (error) {
    console.error('Error retrieving HealthCareProfessionals', error);
    return res.status(500).json({ success: false, message: 'Error retrieving HealthCareProfessionals', error });
  }
};

// Create HealthCareProfessional
export const createHealthCareProfessional = async (req: Request, res: Response) => {
  const { error } = createHealthCareProfessionalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const userId = req.body.userId;

  try {
    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ success: false, message: 'User does not exist' });
    }    
    // Check if the user role is "HEALTHCARE_PROFESSIONAL"
    if (userExists.role !== 'HEALTHCARE_PROFESSIONAL') {
      return res.status(400).json({ success: false, message: 'User role is not healthcare professional' });
    }
    // Check if a profile already exists for the user
    const existingProfile = await HealthCareProfessional.findOne({ userId });

    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'HealthCareProfessional profile already exists for this user' });
    }
    // Create a new HealthCareProfessional profile
    const newHealthCareProfessional = new HealthCareProfessional(req.body);
    await newHealthCareProfessional.save();
    
    res.status(201).json({ success: true, data: newHealthCareProfessional });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating HealthCareProfessional', error });
  }
};

// Update HealthCareProfessional
export const updateHealthCareProfessional = async (req: Request, res: Response) => {
  const { error } = updateHealthCareProfessionalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const updatedHealthCareProfessional = await HealthCareProfessional.findOneAndUpdate({userId: req.params.id, ...req.body});
    if (!updatedHealthCareProfessional) {
      return res.status(404).json({ success: false, message: 'HealthCareProfessional not found' });
    }
    res.status(200).json({ success: true, data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating HealthCareProfessional', error });
  }
}

// Delete HealthCareProfessional
export const deleteHealthCareProfessional = async (req: Request, res: Response) => {
  try {
    const deletedHealthCareProfessional = await HealthCareProfessional.findByIdAndDelete(req.params.id);
    if (!deletedHealthCareProfessional) {
      return res.status(404).json({ success: false, message: 'HealthCareProfessional not found' });
    }
    res.status(200).json({ success: true, message: 'HealthCareProfessional deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting HealthCareProfessional', error });
  }
}

// GET /api/documents
export const getDocuments = async (req: Request, res: Response) => {
  try {
    const documents = await DocumentModel.find();
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving documents', error });
  }
};

// GET /api/documents/:id
export const getDocumentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.status(200).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving document', error });
  }
};

// POST /api/documents
export const createDocument = async (req: Request, res: Response) => {
  const { title, fileType, url } = req.body;
  try {
    const newDocument = new DocumentModel({ title, fileType, url });
    await newDocument.save();
    res.status(201).json({ success: true, data: newDocument });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating document', error });
  }
};

// PUT /api/documents/:id
export const updateDocument = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, fileType, url } = req.body;
  try {
    const updatedDocument = await DocumentModel.findByIdAndUpdate(id, { name, fileType, url }, { new: true });
    if (!updatedDocument) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.status(200).json({ success: true, data: updatedDocument });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating document', error });
  }
};

// DELETE /api/documents/:id
export const deleteDocument = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedDocument = await DocumentModel.findByIdAndDelete(id);
    if (!deletedDocument) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting document', error });
  }
};

export const createCaregiver = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.body;

  try {
    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ success: false, message: 'User does not exist' });
    }
    // Check if the user role is "caregiver"
    if (userExists.role !== 'CAREGIVER') {
      return res.status(400).json({ success: false, message: 'User role is not caregiver' });
    }
    // Check if a caregiver profile already exists for the user
    const existingProfile = await Caregiver.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'Caregiver profile already exists for this user' });
    }

    // Create a new Caregiver profile
    const newCaregiver = new Caregiver(req.body);
    await newCaregiver.save();

    return res.status(201).json({ success: true, data: newCaregiver });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error creating Caregiver', error });
  }
};

// Get Caregiver or All Caregivers
export const getCaregiver = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.query;
  const { page = 1, limit = 10 } = req.query;

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

    if (userId) {
      const caregiver = await Caregiver.findOne({ userId: userId }).populate('documents');
      if (!caregiver) {
        return res.status(404).json({ success: false, message: 'Caregiver not found' });
      }
      return res.status(200).json({ success: true, data: caregiver });
    } else {
      const result = await paginate(Caregiver, {}, options.page, options.limit);

      return res.status(200).json({
        success: true,
        data: result.docs,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        total: result.total,
        limit: result.limit
      });
    }
  } catch (error) {
    console.error('Error retrieving Caregivers', error);
    return res.status(500).json({ success: false, message: 'Error retrieving Caregivers', error });
  }
};

// Update a Caregiver by ID
export const updateCaregiverById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const caregiver = await Caregiver.findOneAndUpdate({userId:req.params.id, ...req.body}).populate('documents');
    if (!caregiver) {
      return res.status(404).json({ success: false, message: 'Caregiver not found' });
    }
    return res.status(200).json({ success: true, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating Caregiver', error });
  }
};

// Delete a Caregiver by ID
export const deleteCaregiverById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const caregiver = await Caregiver.findByIdAndDelete(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ success: false, message: 'Caregiver not found' });
    }
    return res.status(200).json({ success: true, message: 'Caregiver deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting Caregiver', error });
  }
};