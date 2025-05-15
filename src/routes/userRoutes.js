import { Router } from "express";
import { getUsers } from "../controllers/ciudadano/dashboard.controller.js";

const userRoute = Router()

userRoute.get("/users", getUsers)

export default userRoute