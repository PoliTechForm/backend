//gestion de empleados basicamente
import pool from "../../dataBase/pool.js";

//! ACTUALIZA LOS DATOS DE UN EMPLEADO O CIUDADANO

export const updateEmployeeUser = async (req, res) => {
  const userRequester = req.user; // usuario que hace la petición, con su rol
  const { id } = req.params;
  const { nombre, email, password, role_id } = req.body;
  console.log("body", req.body);

  if (!id) {
    return res.status(400).json({ msg: "ID no encontrado" });
  }

  try {
    // Buscar usuario a modificar
    const userToUpdate = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userToUpdate.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    let updates = [];
    let values = [];
    let count = 1;

    // Permisos según rol
    const isAdmin = userRequester.role_id === 'ab600be8-4a3a-4b97-a5cb-45ae1c41701a'; // ROLE_ADMIN

    // Campos básicos permitidos para todos
    if (nombre) {
      updates.push(`nombre = $${count++}`);
      values.push(nombre);
    }
    if (email) {
      updates.push(`email = $${count++}`);
      values.push(email);
    }
    if (password) {
      updates.push(`password = $${count++}`);
      values.push(password);
    }

    // Solo admin puede cambiar rol
    if (role_id && isAdmin) {
      // Validar que role_id exista
      const roleCheck = await pool.query('SELECT id FROM roles WHERE id = $1', [role_id]);
      if (roleCheck.rows.length === 0) {
        return res.status(400).json({ msg: "Rol no válido" });
      }
      updates.push(`role_id = $${count++}`);
      values.push(role_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({ msg: "No se proporcionaron campos para actualizar" });
    }

    values.push(id);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${count}
    `;

    await pool.query(query, values);

    return res.status(200).json({ msg: "Usuario actualizado exitosamente" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al actualizar el usuario" });
  }
};