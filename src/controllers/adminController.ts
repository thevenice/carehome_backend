import { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
import { createUserSchema, updateUserSchema } from '../utils/adminValidations';

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