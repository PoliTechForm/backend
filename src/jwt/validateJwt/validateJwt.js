//hacete cargo marce
import jwt from "jsonwebtoken"
import pool from '../../dataBase/pool.js';
import { SECRET_KEY } from "../../env/env.js";

export const validarJwt = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json('No se encontró el token');
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(401).json('Token inválido');
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Error al validar JWT:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

