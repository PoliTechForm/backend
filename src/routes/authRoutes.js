import { Router } from 'express';
import { registerUser,verifyEmail } from '../controllers/auth/authController.js';

const authRouter = Router();

authRouter.post('/register', registerUser);

authRouter.post('/verify', verifyEmail);

export default authRouter;
