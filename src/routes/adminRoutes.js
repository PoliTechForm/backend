import { updateEmployeeUser } from "../controllers/administrador/empleado.controller.js";
import { Router } from "express";
import { validarJwt } from "../jwt/validateJwt/validateJwt.js";
import { toggleUserStatus } from "../controllers/administrador/empleado.controller.js";

export const adminRoute = Router()

//! PERMITE AL ADMINISTRADOR ACTUALIZAR LOS DATOS DE UN EMPLEADO O CIUDADANO
adminRoute.patch("/updateAllUsers/:id", validarJwt, updateEmployeeUser)


//! PERMITE AL ADMINISTRADOR SUSPENDER O ACTIVAR UN USUARIO
adminRoute.patch("/toggleStatus/:id", validarJwt, toggleUserStatus);
