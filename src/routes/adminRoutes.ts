import express from 'express';
import * as adminController from '../controllers/adminController';
import authenticateJWT from '../middlewares/auth';
import { careHomeLogo, profilePicUpload } from '../middlewares/profilePictureUpload';
import bodyParserFormData from '../middlewares/bodyParserFormData';

const router = express.Router();

router.get('/884919', adminController.createDummyAdmin);

// Get User
router.get('/user', authenticateJWT(['ADMINISTRATOR']), adminController.getUser);

// Create User
router.post('/user', [profilePicUpload.single('profile_picture'), bodyParserFormData], authenticateJWT(['ADMINISTRATOR']), adminController.createUser);

// Update User
router.put('/user/:id', [profilePicUpload.single('profile_picture'), bodyParserFormData],  authenticateJWT(['ADMINISTRATOR']), adminController.updateUser);

// Update or Post Company Info
router.post('/company-info',  [careHomeLogo.single('logo'), bodyParserFormData], adminController.createOrUpdateCompanyInfo);

// Get Company Info
router.get('/company-info', adminController.getCompanyInfo);

export default router;
