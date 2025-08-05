import { Router } from "express";
import { getEmployeesAndCitizens } from "../controllers/generalControllers/employeeAdminControllers.js";
import { getUserProfile, updateProfile } from "../controllers/auth/authController.js";
import { validarJwt } from "../jwt/validateJwt/validateJwt.js"; 

const userRoute = Router();

//! PERMITE AL ADMINISTRADOR Y AL EMPLEADO VER TODOS LOS USUARIOS
userRoute.get("/users", getEmployeesAndCitizens);

// Rutas protegidas
userRoute.get("/profile", validarJwt, getUserProfile); // Ver perfil
userRoute.put("/update", validarJwt, updateProfile);   // Actualizar perfil

export default userRoute;
