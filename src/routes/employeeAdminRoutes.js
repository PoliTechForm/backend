import { validarJwt } from "../jwt/validateJwt/validateJwt.js";
import { createUser } from "../controllers/generalControllers/employeeAdminControllers.js";
import { Router } from "express";
import { deleteUser } from "../controllers/empleado/employee.controller.js";
import { validationError } from "../middlewares/validatorResult.js";
import { validarNuevoUsuario } from "../validations/validations.js";

export const employeeAdminRoute = Router();

//! PERMITE AL EMPLEADO Y AL ADMINISTRADOR CREAR USUARIOS

employeeAdminRoute.post("/createUser", validarJwt, validarNuevoUsuario, validationError, createUser);

employeeAdminRoute.delete("/deleteUser/:id", validarJwt, deleteUser)
