import { Router } from "express";
import {  getMyReports, updateInfoUser, deleteUser, createTemplate, getTemplates } from "../controllers/empleado/employee.controller.js";
import { validarJwt } from "../jwt/validateJwt/validateJwt.js";


export const employeeRoute = Router();



// obtener reportes 
employeeRoute.get("/reportes", validarJwt, getMyReports);

employeeRoute.post("/plantillas", validarJwt, createTemplate);
employeeRoute.get("/plantillas", validarJwt, getTemplates);


employeeRoute.put("/usuarios/:id", validarJwt, updateInfoUser);
employeeRoute.delete("/usuarios/:id", validarJwt, deleteUser);