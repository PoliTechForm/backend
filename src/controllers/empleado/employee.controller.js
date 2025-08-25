import pool from "../../dataBase/pool.js";
import bcrypt from "bcrypt";
import { generateReportService, getMyReportsService, updateInfoUserService, deleteUserService } from "../../services/employeeServices/employees.services.js";
import { validationResult } from "express-validator";

// Generar reporte
export const generateReport = async (req, res) => {
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

//  Obtener los reportes del empleado
export const getMyReports = async (req, res) => {
    const user = req.user;

    try {
        const reportes = await getMyReportsService(user);
        res.status(200).json({ reportes });
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message || "Error al obtener los reportes" });
    }
};


export const updateInfoUser = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { nombre, email, password } = req.body;
    try {
        await updateInfoUserService(user, id, nombre, email, password);
        res.status(200).json({ msg: "Usuario actualizado exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error al actualizar el usuario" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteUserService(id);
        return res.status(200).json({ msg: "Usuario eliminado exitosamente." });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || "Error al eliminar el usuario." });
    }
};

// Crear nueva plantilla
export const createTemplate = async (req, res) => {
    const { titulo, contenido } = req.body;

    if (!titulo || !contenido) {
        return res.status(400).json({ msg: "Título y contenido son obligatorios" });
    }

    try {
        const contenido_json = JSON.stringify({ texto: contenido });

        const query = `
            INSERT INTO documents (titulo, contenido_json, fecha_creacion)
            VALUES ($1, $2, NOW())
            RETURNING *;
        `;
        const values = [titulo, contenido_json];
        const result = await pool.query(query, values);
        res.status(201).json({ template: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al crear la plantilla" });
    }
};

// Obtener todas las plantillas
export const getTemplates = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM documents ORDER BY fecha_creacion DESC");
        res.status(200).json({ templates: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al obtener las plantillas" });
    }
};