// employee.routes.js
import { Router } from "express";
import { generateReport, updateInfoUser, deleteUser } from "../controllers/empleado/employee.controller.js";
import { validarJwt } from "../jwt/validateJwt/validateJwt.js";
import { body } from "express-validator";

export const employeeRoute = Router();

// Validación de reporte
const validarReporte = [
    body("asunto").notEmpty().withMessage("El asunto es obligatorio"),
    body("description").notEmpty().withMessage("La descripción es obligatoria")
];

// Rutas de empleado
employeeRoute.post("/reportes", validarJwt, validarReporte, generateReport);
employeeRoute.put("/usuarios/:id", validarJwt, updateInfoUser);
employeeRoute.delete("/usuarios/:id", validarJwt, deleteUser);
    