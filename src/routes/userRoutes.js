import { Router } from "express";
import { getEmployeesAndCitizens } from "../controllers/generalControllers/employeeAdminControllers.js";
// Importa las funciones de perfil y actualización de nombre desde authController
import { getUserProfile, updateUserName } from "../controllers/auth/authController.js";
// Importa tu middleware de validación de JWT
import { validarJwt } from "../jwt/validateJwt/validateJwt.js"; 

const userRoute = Router()

//! PERMITE AL ADMINISTRADOR Y AL EMPLEADO VER TODOS LOS USUARIOS


userRoute.get("/users", getEmployeesAndCitizens)

// Rutas protegidas para usuario autenticado (requiere validarJwt)
// Estas rutas se accederán como /api/profile y /api/update-name debido a app.js
userRoute.get("/profile", validarJwt, getUserProfile); // <-- Agregado
userRoute.put("/update-name", validarJwt, updateUserName); // <-- Agregado

export default userRoute;

