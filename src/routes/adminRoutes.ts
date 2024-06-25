import express from 'express'
import * as adminController from '../controllers/adminController'
import authenticateJWT from '../middlewares/auth'
import {
  careHomeLogo,
  profilePicUpload,
  usersDocuments,
} from '../middlewares/profilePictureUpload'
import bodyParserFormData from '../middlewares/bodyParserFormData'

const router = express.Router()

router.get('/884919', adminController.createDummyAdmin)

// Get User
router.get('/user', authenticateJWT(['ADMINISTRATOR']), adminController.getUser)

// Create User
router.post(
  '/user',
  [profilePicUpload.single('profile_picture_image'), bodyParserFormData],
  authenticateJWT(['ADMINISTRATOR']),
  adminController.createUser,
)

// Update User
router.put(
  '/user/:id',
  [profilePicUpload.single('profile_picture_image'), bodyParserFormData],
  authenticateJWT(['ADMINISTRATOR']),
  adminController.updateUser,
)

// Update or Post Company Info
router.post(
  '/company-info',
  [careHomeLogo.single('logo'), bodyParserFormData],
  adminController.createOrUpdateCompanyInfo,
)

// Get Company Info
router.get('/company-info', adminController.getCompanyInfo)


// documents APIs
router.get('/documents', adminController.getDocuments);
router.post('/documents', 
[usersDocuments.single('file'), bodyParserFormData],
authenticateJWT(['ADMINISTRATOR']),
adminController.createDocument);
router.put('/documents/:id',
[usersDocuments.single('file'), bodyParserFormData],
authenticateJWT(['ADMINISTRATOR']),
adminController.updateDocument);
router.delete('/documents/:id', adminController.deleteDocument);

// healthcare professionals APIs
router.get('/healthcare-professionals', adminController.getHealthCareProfessional);
router.post('/healthcare-professionals', adminController.createHealthCareProfessional);
router.put('/healthcare-professionals/:id', adminController.updateHealthCareProfessional);
router.delete('/healthcare-professionals/:id', adminController.deleteHealthCareProfessional);

// residents APIs
router.get('/residents', adminController.getResident);
router.post('/residents', adminController.createResident);
router.put('/residents/:id', adminController.updateResident);
router.delete('/residents/:id', adminController.deleteResident);

// care giver APIs
router.post('/caregivers', adminController.createCaregiver);
router.get('/caregivers', adminController.getCaregiver);
router.put('/caregivers/:id', adminController.updateCaregiverById);
router.delete('/caregivers/:id', adminController.deleteCaregiverById);

export default router
