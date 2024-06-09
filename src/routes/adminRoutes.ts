import express from 'express';
import * as adminController from '../controllers/adminController';
import authenticateJWT from '../middlewares/auth';

const router = express.Router();

router.get('/884919', adminController.createDummyAdmin);

// Get User
router.get('/user', authenticateJWT(['ADMINISTRATOR']), adminController.getUser);

// Create User
router.post('/user', authenticateJWT(['ADMINISTRATOR']), adminController.createUser);

// Update User
router.put('/user/:id', authenticateJWT(['ADMINISTRATOR']), adminController.updateUser);

// Update or Post Company Info
router.post('/company-info', adminController.createOrUpdateCompanyInfo);

// Get Company Info
router.get('/company-info', adminController.getCompanyInfo);

export default router;
