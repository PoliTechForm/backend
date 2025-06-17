//gestion de empleados basicamente
import pool from "../../dataBase/pool.js";

//! ACTUALIZA LOS DATOS DE UN EMPLEADO O CIUDADANO

export const updateEmployeeUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password, role_nombre } = req.body;

    if (!id) {
        return res.status(400).json({ msg: "ID no encontrado" });
    }

    try {
        // Buscar usuario
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        let role_id = null;
        if (role_nombre) {
            const roleResult = await pool.query(
                'SELECT id FROM roles WHERE nombre = $1',
                [role_nombre]
            );
            if (roleResult.rows.length === 0) {
                return res.status(404).json({ msg: "Rol no encontrado" });
            }
            role_id = roleResult.rows[0].id;
        }

        const updates = [];
        const values = [];
        let count = 1;

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
        if (role_id) {
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
  