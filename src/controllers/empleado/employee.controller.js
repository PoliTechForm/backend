//busca y ve estado de usuarios ciudadanos
import pool from "../../dataBase/pool.js"
import bcrypt from "bcrypt"

export const generateReport = async (req, res) => {
    const user = req.user
    const {asunto, description} = req.body
    try {
        const nombre = user.nombre
        const result = await pool.query(` SELECT r.nombre FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`, [user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (result.rows[0].nombre !== 'Empleado') {
        return res.status(403).json({ msg: 'No tienes acceso a esa función' });
        }

        await pool.query('INSERT INTO reports (user_id, nombre, asunto, description) VALUES ($1, $2, $3, $4)', [user.id, nombre, asunto, description])
        
        res.status(201).json({msg:"Reporte enviado exitosamente"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({msg: "Hubo un error inesperado"})
    }
}

export const updateInfoUser = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    const result = await pool.query(` SELECT r.nombre FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`, [user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({msg: 'Usuario no encontrado'});
        }

    if (result.rows[0].nombre !== 'Empleado') {
        return res.status(403).json({msg: 'No tienes acceso a esa función'});
    }

    if (!id) {
        return res.status(400).json({ msg: "ID no encontrado" });
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
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
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            updates.push(`password_hash = $${count++}`);
            values.push(passwordHash);
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

export const deleteUser = async(req, res) => {}