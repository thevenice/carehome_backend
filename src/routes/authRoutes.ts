// src/routes/authRoutes.ts
import express from 'express';
import * as authController from '../controllers/authController';
import authenticateJWT from '../middlewares/auth'

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/verify-otp
router.post('/verify-otp', authController.verifyOtp);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/refresh-token
router.post('/refresh-token', authController.refreshToken);

// POST /api/auth/change-password
router.post('/change-password', authController.changePassword);

// POST /api/auth/reset-password-request
router.post('/reset-password-request', authController.resetPasswordRequest);

// POST /api/auth/reset-password
router.post('/reset-password',  authenticateJWT(['ADMINISTRATOR', 'INTERVIEW-CANDIDATE']), authController.resetPassword);

// POST /api/auth/reset-password-send-otp
router.post('/reset-password-send-otp', authController.sendResetPasswordOtp);

// POST /api/auth/reset-password-verify-otp
router.post('/reset-password-verify-otp', authController.resetPasswordWithOtp);

export default router;