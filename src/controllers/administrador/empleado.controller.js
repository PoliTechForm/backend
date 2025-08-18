//gestion de empleados basicamente
import { updateEmployeeUserService } from "../../services/employeeServices/employees.services.js";

import pool from "../../dataBase/pool.js";
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
    const result = await pool.query(
      `UPDATE users
       SET estado_cuenta = CASE 
                             WHEN estado_cuenta = 'activo' THEN 'suspendido'
                             ELSE 'activo'
                           END
       WHERE id = $1
       RETURNING estado_cuenta`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    const nuevoEstado = result.rows[0].estado_cuenta;

    return res.status(200).json({
      msg: `Usuario ${nuevoEstado === "activo" ? "activado" : "suspendido"} correctamente.`,
      estado_cuenta: nuevoEstado,
    });
  } catch (err) {
    console.error("Error al cambiar estado de cuenta:", err.message);
    return res.status(500).json({ msg: "Error del servidor." });
  }
};
