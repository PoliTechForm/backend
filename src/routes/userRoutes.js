import { Router } from "express";
import { getUsers } from "../controllers/ciudadano/dashboard.controller.js";
// Importa las funciones de perfil y actualización de nombre desde authController
import { getUserProfile, updateUserName } from "../controllers/auth/authController.js";
// Importa tu middleware de validación de JWT
import { validarJwt } from "../jwt/validateJwt/validateJwt.js"; 

const userRoute = Router();

// Ruta pública para obtener lista de usuarios
userRoute.get("/users", getUsers);

// Rutas protegidas para usuario autenticado (requiere validarJwt)
// Estas rutas se accederán como /api/profile y /api/update-name debido a app.js
userRoute.get("/profile", validarJwt, getUserProfile); // <-- Agregado
userRoute.put("/update-name", validarJwt, updateUserName); // <-- Agregado

export default userRoute;