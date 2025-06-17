import { Router } from "express";
import { getEmployeesAndCitizens } from "../controllers/generalControllers/employeeAdminControllers.js";

const userRoute = Router()

//! PERMITE AL ADMINISTRADOR Y AL EMPLEADO VER TODOS LOS USUARIOS

userRoute.get("/users", getEmployeesAndCitizens)

export default userRoute