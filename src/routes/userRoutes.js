import { Router } from "express";
import { getEmployeesAndCitizens } from "../controllers/generalControllers/employeeAdminControllers.js";
import { getUserProfile, updateUserProfile } from "../controllers/auth/authController.js";
import { validarJwt } from "../jwt/validateJwt/validateJwt.js";
import { createReport, getMyReports } from "../controllers/ciudadano/tramite.controller.js";
import { body } from "express-validator";
import { validationError } from "../middlewares/validatorResult.js"; 

const userRoute = Router();

// Validación de reporte
const validarReporte = [
    body("asunto")
        .notEmpty().withMessage("El asunto es obligatorio")
        .isIn(["Bug", "Error", "Sugerencia", "Otro"])
        .withMessage("El asunto debe ser: Bug, Error, Sugerencia o Otro"),
    body("description").notEmpty().withMessage("La descripción es obligatoria")
];

//! PERMITE AL ADMINISTRADOR Y AL EMPLEADO VER TODOS LOS USUARIOS
userRoute.get("/users", getEmployeesAndCitizens);

// Rutas protegidas
userRoute.get("/profile", validarJwt, getUserProfile); // Ver perfil
userRoute.patch("/update-profile", validarJwt, updateUserProfile);   // Actualizar perfil

//! RUTAS DE REPORTES PARA CIUDADANOS Y EMPLEADOS
userRoute.post("/reportes", validarJwt, validarReporte, validationError, createReport);
userRoute.get("/reportes", validarJwt, getMyReports);

export default userRoute;
