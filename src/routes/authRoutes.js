import { Router } from 'express';
import { getSession, loginUser, logoutUser, registerUser,verifyEmail, verify2FACode, changePassword, forgotPassword, resetPassword, enableOrDisableTwoFactor } from '../controllers/auth/authController.js';
import { validarJwt } from '../jwt/validateJwt/validateJwt.js';
import { validationError } from '../middlewares/validatorResult.js';
import { validarLogin, validarRegistro, validarRecuperacion, validarResetPassword } from '../validations/validations.js';

const authRouter = Router();

authRouter.post('/register', validarRegistro, validationError, registerUser);

authRouter.post('/login', validarLogin, validationError, loginUser)

authRouter.get('/verify', verifyEmail);

authRouter.post('/verifity', verify2FACode);

authRouter.get('/session', validarJwt, getSession)

authRouter.post('/logout',logoutUser)

authRouter.post("/changePassword",validarJwt ,changePassword)

authRouter.post("/forgotPassword", validarRecuperacion, validationError, forgotPassword);

authRouter.post("/resetPassword", validarResetPassword, validationError, resetPassword);

authRouter.post("/enableDisable2fa", validarJwt, enableOrDisableTwoFactor )

export default authRouter;
