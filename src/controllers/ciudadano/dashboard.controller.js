import pool from "../../dataBase/pool.js";

// sirve para ver el uso del sistema que tiene el usuario
export const getUsers = async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};
