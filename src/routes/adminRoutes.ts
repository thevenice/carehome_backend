import express from 'express';
import { createDummyAdmin } from '../controllers/AdminController'

const router = express.Router();

router.get('/884919', createDummyAdmin);

export default router;
