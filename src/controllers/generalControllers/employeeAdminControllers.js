import pool from "../../dataBase/pool.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import sendVerificationEmail from "../../services/verify.Email.Service.js";
import { createUserService } from "../../services/employeeServices/employees.services.js";
import { validationResult } from "express-validator";
import { generateReportService } from "../../services/employeeServices/employees.services.js";

export const createUser = async(req, res) => {
    const user = req.user;
    const { nombre, dni, email, password, role, sexo, location_id } = req.body;
    
      try {
        await createUserService(user, nombre, dni, email, password, role, sexo, location_id);
        res.status(201).json({
          message: 'Usuario creado con éxito.'
        });
      } catch (err) {
        console.error('Error en el registro:', err.message);
        res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
      }
}

export const getEmployeesAndCitizens = async (_req, res) => {
    try {
      const result = await pool.query(`
        SELECT u.*, r.nombre AS rol
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE r.nombre IN ('ciudadano', 'Empleado')
      `);
  
      return res.status(200).json(result.rows);
  
    } catch (err) {
      console.error('Error al obtener usuarios:', err.message);
      res.status(500).json({ error: 'Error del servidor' });
    }
  };


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
