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
    const existingUser = await User.findOne({email: req.body.email})

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const newUser = new User(req.body);
    if (req.file) newUser.profile_picture = req.file.filename; //profile_picture upload through multer
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
    const updateData = req.body
    if (req.file) updateData.profile_picture = req.file.filename; //profile_picture upload through multer
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
      if (req.body.contactInfo) {
        const contactInfoJson = JSON.parse(req.body.contactInfo)
        existingCompanyInfo.contactInfo = contactInfoJson;
      }
      if (req.body.servicesOffered) {
        const servicesOfferedJson = JSON.parse(req.body.servicesOffered)
        existingCompanyInfo.servicesOffered = servicesOfferedJson;
        
      }
      if (req.body.facilitiesAmenities) {
        const facilitiesAmenitiesJson = JSON.parse(req.body.facilitiesAmenities)
        existingCompanyInfo.facilitiesAmenities = facilitiesAmenitiesJson;

      }

      if (req.body.location) existingCompanyInfo.location = req.body.location;
      if (req.body.images) existingCompanyInfo.images = req.body.images;
      if (req.body.aboutUs) existingCompanyInfo.aboutUs = req.body.aboutUs;
      if (req.body.testimonials) existingCompanyInfo.testimonials = req.body.testimonials;
      if (req.body.linkedin) existingCompanyInfo.linkedin = req.body.linkedin;
      if (req.body.googleMap) existingCompanyInfo.googleMap = req.body.googleMap;
      if (req.body.xCom) existingCompanyInfo.xCom = req.body.xCom;
      if (req.body.instagram) existingCompanyInfo.instagram = req.body.instagram;
      if (req.body.facebook) existingCompanyInfo.facebook = req.body.facebook;
      if (req.body.whatsapp) existingCompanyInfo.whatsapp = req.body.whatsapp;
      if (req.body.telegram) existingCompanyInfo.telegram = req.body.telegram;
      if (req.file) existingCompanyInfo.logo = req.file.filename; //logo upload through multer

      await existingCompanyInfo.save();
      return res.status(200).json({ success: true, data: existingCompanyInfo });
    } else {
      const dataJson = req.body;
      if (dataJson.contactInfo){
      const contactInfoData = JSON.parse(dataJson.contactInfo)
      dataJson.contactInfo = contactInfoData
    }
      if (dataJson.servicesOffered){
      const servicesOfferedData = JSON.parse(dataJson.servicesOffered)
      dataJson.servicesOffered = servicesOfferedData
    }
      if (dataJson.facilitiesAmenities){
      const facilitiesAmenitiesData = JSON.parse(dataJson.facilitiesAmenities)
      dataJson.facilitiesAmenities = facilitiesAmenitiesData
    }
    const newCompanyInfo = new CompanyInfo(dataJson);
      
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

    // Get the path to the logo file
    const logoPath = companyInfo.logo ? `http://localhost:9091/logo/data/${companyInfo.logo}` : null;
    console.log("logoPath: ", logoPath)
    
    if (logoPath) {
      try {
        return res.status(200).json({
          success: true,
          data: {
            ...companyInfo.toObject(), // Convert the Mongoose document to a plain object
            logo: logoPath
          }
        });
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Error reading logo file', error: err });
      }
    } else {
      // If there's no logo path, return the company info without the logo
      return res.status(200).json({
        success: true,
        data: companyInfo.toObject()
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving company info', error });
  }
};
