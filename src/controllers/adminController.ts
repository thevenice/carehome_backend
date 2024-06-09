import { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
import { companyInfoSchema, createUserSchema, updateUserSchema } from '../utils/adminValidations';
import CompanyInfo from '../models/CompanyInfoModel';

export const createDummyAdmin = async (req: Request, res: Response) => {
  try {
    const adminEmail = 'admin@admin.com';
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin already exists' });
    }
    
    // Create a new admin user
    const adminUser: IUser = new User({
      email: adminEmail,
      password: 'ADMIN@password123!', // Remember to use a strong password in production
      role: 'ADMINISTRATOR',
      email_verification: 'COMPLETED',
    });
    
    await adminUser.save();
    
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin user', error });
  }
};


// Get User or All Users
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { page = 1, limit = 10 } = req.query;

  try {
    const pageNum:number = Number(page)
    const limitNum:number = Number(limit)
    if (id) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, data: user });
    } else {
      const users = await User.find()
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
      const total = await User.countDocuments();

      return res.status(200).json({
        success: true,
        data: users,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving users', error });
  }
};

// Create User
export const createUser = async (req: Request, res: Response) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Error creating user', error });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Error updating user', error });
  }
};

export const createOrUpdateCompanyInfo = async (req: Request, res: Response): Promise<Response> => {
  const { error } = companyInfoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const existingCompanyInfo = await CompanyInfo.findOne();

    if (existingCompanyInfo) {
      // Update only the fields that are present in the request body
      if (req.body.name) existingCompanyInfo.name = req.body.name;
      if (req.body.contactInfo) existingCompanyInfo.contactInfo = req.body.contactInfo;
      if (req.body.location) existingCompanyInfo.location = req.body.location;
      if (req.body.images) existingCompanyInfo.images = req.body.images;
      if (req.body.aboutUs) existingCompanyInfo.aboutUs = req.body.aboutUs;
      if (req.body.servicesOffered) existingCompanyInfo.servicesOffered = req.body.servicesOffered;
      if (req.body.facilitiesAmenities) existingCompanyInfo.facilitiesAmenities = req.body.facilitiesAmenities;
      if (req.body.testimonials) existingCompanyInfo.testimonials = req.body.testimonials;
      if (req.body.linkedin) existingCompanyInfo.linkedin = req.body.linkedin;
      if (req.body.google_map) existingCompanyInfo.google_map = req.body.google_map;
      if (req.body.x_com) existingCompanyInfo.x_com = req.body.x_com;
      if (req.body.instagram) existingCompanyInfo.instagram = req.body.instagram;
      if (req.body.facebook) existingCompanyInfo.facebook = req.body.facebook;
      if (req.body.whatsapp) existingCompanyInfo.whatsapp = req.body.whatsapp;
      if (req.body.telegram) existingCompanyInfo.telegram = req.body.telegram;
      if (req.file) existingCompanyInfo.logo = req.file.path; //logo upload through multer

      await existingCompanyInfo.save();
      return res.status(200).json({ success: true, data: existingCompanyInfo });
    } else {
      const newCompanyInfo = new CompanyInfo(req.body);
      if (req.file) newCompanyInfo.logo = req.file.path; //logo upload through multer

      await newCompanyInfo.save();
      return res.status(201).json({ success: true, data: newCompanyInfo });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error saving company info', error });
  }
};

export const getCompanyInfo = async (req: Request, res: Response): Promise<Response> => {
  try {
    const companyInfo = await CompanyInfo.findOne();
    if (!companyInfo) {
      return res.status(404).json({ success: false, message: 'Company info not found' });
    }
    return res.status(200).json({ success: true, data: companyInfo });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving company info', error });
  }
};
