import express from 'express';
import { registerUser,verifyEmail } from '../controllers/auth/authController.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/verify', verifyEmail);

export default router;
