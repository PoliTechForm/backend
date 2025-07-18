import { Router } from "express";
import { getEmployeesAndCitizens } from "../controllers/generalControllers/employeeAdminControllers.js";
import { updateProfile } from '../controllers/auth/authController.js';
import { validarJwt } from '../jwt/validateJwt/validateJwt.js';

const userRoute = Router()

//! PERMITE AL ADMINISTRADOR Y AL EMPLEADO VER TODOS LOS USUARIOS

userRoute.get("/users", getEmployeesAndCitizens)

// Ruta para que el usuario autenticado actualice su perfil
userRoute.patch('/profile', validarJwt, updateProfile);

export default userRoute