import { Router } from 'express';
import { loginUser, registerUser,verifyEmail } from '../controllers/auth/authController.js';

const authRouter = Router();
authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);

authRouter.post('/verify', verifyEmail);

export default authRouter;
