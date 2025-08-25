import { Router } from "express";
import { generateReport, getMyReports, updateInfoUser, deleteUser, createTemplate, getTemplates } from "../controllers/empleado/employee.controller.js";import { validarJwt } from "../jwt/validateJwt/validateJwt.js";
import { body } from "express-validator";

export const employeeRoute = Router();

// Validación de reporte
const validarReporte = [
    body("asunto").notEmpty().withMessage("El asunto es obligatorio"),
    body("description").notEmpty().withMessage("La descripción es obligatoria")
];

// Rutas de empleado
employeeRoute.post("/reportes", validarJwt, validarReporte, generateReport);

// obtener reportes 
employeeRoute.get("/reportes", validarJwt, getMyReports);

employeeRoute.post("/plantillas", validarJwt, createTemplate);
employeeRoute.get("/plantillas", validarJwt, getTemplates);


employeeRoute.put("/usuarios/:id", validarJwt, updateInfoUser);
employeeRoute.delete("/usuarios/:id", validarJwt, deleteUser);