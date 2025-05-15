import { Router } from 'express';
import { getSession, loginUser, logoutUser, registerUser,verifyEmail } from '../controllers/auth/authController.js';
import { validarJwt } from '../jwt/validateJwt/validateJwt.js';
import { validationError } from '../middlewares/validatorResult.js';
import { validarLogin, validarRegistro } from '../validations/validations.js';

const authRouter = Router();

authRouter.post('/register', validarRegistro, validationError, registerUser);

authRouter.post('/login', validarLogin, validationError, loginUser)

authRouter.get('/verify', verifyEmail);

authRouter.get('/session', validarJwt, getSession)

authRouter.post('/logout',logoutUser)

export default authRouter;
