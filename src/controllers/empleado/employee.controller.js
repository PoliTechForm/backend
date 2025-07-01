//busca y ve estado de usuarios ciudadanos
import pool from "../../dataBase/pool.js"
import bcrypt from "bcrypt"
import { generateReportService, updateInfoUserService, deleteUserService} from "../../services/employeeServices/employees.services.js"

export const generateReport = async (req, res) => {
    const user = req.user
    const {asunto, description} = req.body
    try {
        await generateReportService(user, asunto, description)
        res.status(201).json({msg:"Reporte enviado exitosamente"})
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message || "Hubo un error inesperado" });
    }
}

export const updateInfoUser = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { nombre, email, password } = req.body;
    try {
        await updateInfoUserService(user, id, nombre, email, password)
        res.status(200).json({ msg: "Usuario actualizado exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error al actualizar el usuario" });
    }
};

export const deleteUser = async(req, res) => {
    try {
        const {id} = req.params
        await deleteUserService(id);
       return res.status(200).json({ msg: "Usuario eliminado exitosamente." });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || "Error al eliminar el usuario." });
    }
}