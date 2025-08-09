//gestion de empleados basicamente
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