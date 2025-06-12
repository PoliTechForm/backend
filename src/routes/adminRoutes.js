import { updateEmployeeUser } from "../controllers/administrador/empleado.controller.js";
import { Router } from "express";
import { validarJwt } from "../jwt/validateJwt/validateJwt.js";

export const adminRoute = Router()

//! PERMITE AL ADMINISTRADOR ACTUALIZAR LOS DATOS DE UN EMPLEADO O CIUDADANO
adminRoute.patch("/updateEmployeeUser/:id", validarJwt, updateEmployeeUser)
