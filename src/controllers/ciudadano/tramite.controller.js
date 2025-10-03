//para ver tramites
import { validationResult } from "express-validator";
import { generateReportService, getMyReportsService } from "../../services/employeeServices/employees.services.js";

// Crear reporte - disponible para ciudadanos
export const createReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const { asunto, description } = req.body;

    try {
        await generateReportService(user, asunto, description);
        res.status(201).json({ msg: "Reporte enviado exitosamente" });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message || "Hubo un error inesperado" });
    }
};

// Obtener mis reportes - disponible para ciudadanos
export const getMyReports = async (req, res) => {
    const user = req.user;

    try {
        const reports = await getMyReportsService(user);
        res.status(200).json(reports);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message || "Hubo un error inesperado" });
    }
};