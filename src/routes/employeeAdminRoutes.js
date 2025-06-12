import { validarJwt } from "../jwt/validateJwt/validateJwt.js";
import { createUser } from "../controllers/generalControllers/employeeAdminControllers.js";
import { Router } from "express";

export const employeeAdminRoute = Router();

//! PERMITE AL EMPLEADO Y AL ADMINISTRADOR CREAR USUARIOS


employeeAdminRoute.post("/createUser", validarJwt, createUser)
