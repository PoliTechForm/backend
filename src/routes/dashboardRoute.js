import {Router} from "express"
import { getMetrics } from "../controllers/dashboard/dashboard.controller.js"

export const metricRoutes = Router()

metricRoutes.get("/dashboard", getMetrics)