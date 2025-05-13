import bcrypt from 'bcrypt';
import pool from '../../dataBase/pool.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { RECAPTCHA_SECRET_KEY } from '../../env/env.js';

export const registerUser = async (req, res) => {
  const { nombre, email, password, role = 'ciudadano', captchaToken } = req.body;

  try {
    // Verificar captcha
    const secretKey = RECAPTCHA_SECRET_KEY;
    const captchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: captchaToken,
        },
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({ error: 'Captcha inválido' });
    }

    // Verificar si ya existe el usuario
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Obtener el role_id
    const roleResult = await pool.query('SELECT id FROM roles WHERE nombre = $1', [role]);
    if (roleResult.rows.length === 0) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const roleId = roleResult.rows[0].id;

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear el usuario
    const userId = uuidv4();
    await pool.query(
      `INSERT INTO users (id, nombre, email, password_hash, role_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, nombre, email, passwordHash, roleId]
    );

    return res.status(201).json({ message: 'Usuario registrado con éxito', id: userId });
  } catch (err) {
    console.error('Error en el registro:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, captchaToken } = req.body;

  try {
    const secretKey = RECAPTCHA_SECRET_KEY;
    const captchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: captchaToken,
        },
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({ error: 'Captcha inválido' });
    }

    const result = await pool.query(
      'UPDATE users SET verificado_email = true WHERE email = $1 RETURNING *',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({ message: 'Correo verificado exitosamente' });
  } catch (err) {
    console.error('Error en la verificación de correo:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
