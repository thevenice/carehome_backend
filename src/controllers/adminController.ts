import { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';

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