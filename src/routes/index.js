import express from 'express';
import { loginUser, registerUser } from '../controllers/auth/authController.js';

const router = express.Router();

// Ruta para login
router.post('/login', loginUser);

// Ruta para registro
router.post('/register', registerUser);

export default router;
