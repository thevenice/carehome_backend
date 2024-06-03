// src/controllers/authController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTP } from '../utils/helper';
import { AuthenticatedRequest } from '../types/types'; // Import the custom type

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.email_verification === 'COMPLETED') {
        return res.status(400).json({
          error: `User with email: ${email} already exists. Please try login.`,
        });
      } else {
        const otp = Number(generateOTP());
        existingUser.otp = otp;
        await existingUser.save();

        await sendOTP(email, otp);

        return res.status(200).json({
          success: true,
          message: `Verification OTP resent to ${email}.`,
        });
      }
    }

    const otp = Number(generateOTP());

    const user = new User({
      email,
      password,
      otp,
      email_verification: 'PENDING',
      role: 'INTERVIEW_CANDIDATE',
    });

    await user.save();

    await sendOTP(email, otp);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Check your email for OTP.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Verify OTP
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email, otp, email_verification: 'PENDING' });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid OTP or email, or user is already verified.',
      });
    }

    user.email_verification = 'COMPLETED';
    user.otp = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'OTP verified successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (existingUser.email_verification !== 'COMPLETED') {
      const otp = Number(generateOTP());
      existingUser.otp = otp;
      await existingUser.save();

      await sendOTP(email, otp);

      return res.status(200).json({
        success: true,
        message: `Verification OTP resent to ${email}.`,
      });
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Authentication failed' });
    }

    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_TOKEN_SECRET as string,
      { expiresIn: '7d' },
    );

    let token: string= jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        },
        process.env.JWT_TOKEN_SECRET as string,
        { expiresIn: '8h' },
      );
    

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refresh_token: refreshToken,
      user_id: existingUser._id,
      role: existingUser.role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ success: false, error: 'Refresh token missing' });
  }

  try {
    const decoded: any = jwt.verify(refresh_token, process.env.JWT_TOKEN_SECRET as string);
    const userId = decoded.id;

    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    const new_refresh_token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_TOKEN_SECRET as string,
      { expiresIn: '7d' },
    );

    let token: string;

    if (existingUser.role === 'ADMINISTRATOR') {
      token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          role: 'ADMINISTRATOR',
        },
        process.env.JWT_TOKEN_SECRET as string,
        { expiresIn: '8h' },
      );
    } else {
      token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          role: existingUser.role,
        },
        process.env.JWT_TOKEN_SECRET as string,
        { expiresIn: '8h' },
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Access token refreshed',
      token,
      refresh_token: new_refresh_token,
      user_id: existingUser._id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email }) as IUser | null;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error changing password', error });
  }
};

// Reset Password Request
export const resetPasswordRequest = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token (this should be a more secure token in a real application)
    const resetToken = jwt.sign({ email }, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });

    // Here you should send the resetToken to the user's email
    // For simplicity, we'll just return it in the response
    res.status(200).json({ message: 'Reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Error generating reset token', error });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  try {
    const user = await User.findById((req as AuthenticatedRequest).user.id) as IUser | null;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error resetting password', error });
  }
};

// Send Reset Password OTP
export const sendResetPasswordOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Number(generateOTP());
    user.otp = otp;
    await user.save();

    await sendOTP(email, otp);

    return res.status(200).json({
      success: true,
      message: `Verification OTP sent to ${email}.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Reset Password with OTP
export const resetPasswordWithOtp = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, otp });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid OTP or email, or user is already verified.',
      });
    }

    user.password = newPassword;
    user.otp = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};