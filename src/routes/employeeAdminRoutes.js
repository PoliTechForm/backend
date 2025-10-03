import { validarJwt } from "../jwt/validateJwt/validateJwt.js";
import { createUser } from "../controllers/generalControllers/employeeAdminControllers.js";
import { Router } from "express";
import { validationError } from "../middlewares/validatorResult.js";
import { generateReport } from "../controllers/generalControllers/employeeAdminControllers.js";
import { validarNuevoUsuario } from "../validations/validations.js";
import { deleteUser } from "../controllers/empleado/employee.controller.js";
import { body } from "express-validator";
//

export const employeeAdminRoute = Router();
// Validación de reporte
//! PERMITE AL EMPLEADO Y AL ADMINISTRADOR CREAR USUARIOS

employeeAdminRoute.post("/createUser", validarJwt, validarNuevoUsuario, validationError, createUser);
employeeAdminRoute.delete("/deleteUser/:id", validarJwt, deleteUser)
//!PERMITE TANTO AL EMPLEADO COMO AL ADMIN CREAR REPORTES
employeeAdminRoute.post("/reportes", validarJwt,  validationError, generateReport);  