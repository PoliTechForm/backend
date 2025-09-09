import { Router } from "express";
import { getEmployeesAndCitizens } from "../controllers/generalControllers/employeeAdminControllers.js";
import { getUserProfile, updateUserProfile } from "../controllers/auth/authController.js";
import { validarJwt } from "../jwt/validateJwt/validateJwt.js"; 

const userRoute = Router();

//! PERMITE AL ADMINISTRADOR Y AL EMPLEADO VER TODOS LOS USUARIOS
userRoute.get("/users", getEmployeesAndCitizens);

// Rutas protegidas
userRoute.get("/profile", validarJwt, getUserProfile); // Ver perfil

userRoute.patch("/update-profile", validarJwt, updateUserProfile);   // Actualizar perfil

export default userRoute;
