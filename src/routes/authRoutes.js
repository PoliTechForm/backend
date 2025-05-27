import { Router } from 'express';
import { getSession, loginUser, logoutUser, registerUser,verifyEmail, verify2FACode, changePassword } from '../controllers/auth/authController.js';
import { validarJwt } from '../jwt/validateJwt/validateJwt.js';
import { validationError } from '../middlewares/validatorResult.js';
import { validarLogin, validarRegistro } from '../validations/validations.js';

const authRouter = Router();

authRouter.post('/register', validarRegistro, validationError, registerUser);

authRouter.post('/login', validarLogin, validationError, loginUser)

authRouter.get('/verify', verifyEmail);

authRouter.post('/verifity', verify2FACode);

authRouter.get('/session', validarJwt, getSession)

authRouter.post('/logout',logoutUser)

authRouter.post("/changePassword",validarJwt ,changePassword)

export default authRouter;
