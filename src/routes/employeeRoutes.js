import { Router } from "express";
import { generateReport, updateInfoUser } from "../controllers/empleado/employee.controller.js";
import { validarJwt } from "../jwt/validateJwt/validateJwt.js";

export const employeeRoute = Router()

//! PERMITE AL EMPLEADO ENVIAR REPORTES Y TAMBIÉN ACTUALIZAR DATOS DE CIUDADANOS EN CASO DE QUE LO NECESITEN

employeeRoute.post("/sendReport",validarJwt, generateReport)
employeeRoute.patch("/updateUser/:id", validarJwt, updateInfoUser)