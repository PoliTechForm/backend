import { 
    toggleUserStatusService,
    getAllReportsService
} from "../../services/adminServices/admin.services.js";
import { updateEmployeeUserService } from "../../services/employeeServices/employees.services.js";
//! ACTUALIZA LOS DATOS DE UN EMPLEADO O CIUDADANO
export const updateEmployeeUser = async (req, res) => {
    const userRequester = req.user;
    const { id } = req.params;
    const { nombre, email, dni, password, role_id } = req.body;

    try {
        const msg = await updateEmployeeUserService(userRequester, id, { nombre, email, dni, password, role_id });
        return res.status(200).json({ msg });
    } catch (error) {
        console.error(error);
        const status = error.statusCode || 500;
        const message = error.message || "Error al actualizar el usuario";
        return res.status(status).json({ msg: message });
    }
};

//! CAMBIA EL ESTADO DE CUENTA DE UN USUARIO (activo/suspendido)
export const toggleUserStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const nuevoEstado = await toggleUserStatusService(id);
        return res.status(200).json({
            msg: `Usuario ${nuevoEstado === "activo" ? "activado" : "suspendido"} correctamente.`,
            estado_cuenta: nuevoEstado,
        });
    } catch (err) {
        console.error("Error al cambiar estado de cuenta:", err.message);
        return res.status(err.status || 500).json({ msg: err.message || "Error del servidor." });
    }
};

//! TRAE LOS REPORTES DE TODOS LOS USUARIOS
export const getAllReports = async (req, res) => {
    try {
        const reportes = await getAllReportsService();
        
        return res.status(200).json({ reportes });
    } catch (error) {
        console.error("Error en getAllReports:", error);
        return res.status(error.status || 500).json({ msg: error.message || "Error al obtener los reportes." });
    }
};