import sendVerificationEmail from "./verify.Email.Service.js";
import { RECAPTCHA_SECRET_KEY } from "../env/env.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import pool from "../dataBase/pool.js";
import { createJwt } from "../jwt/createJwt/createJwt.js";

export const registerUserService = async (nombre, email, password, role = "ciudadano", captchaToken) => {
  // Verificar captcha
  const captchaResponse = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    null,
    {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      },
    }
  );

  if (!captchaResponse.data.success) {
    const error = new Error('Captcha inválido');
    error.status = 400;
    throw error;
  }

  // Verificar si ya existe el usuario
  const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userExists.rows.length > 0) {
    const error = new Error('El correo ya está registrado');
    error.status = 400;
    throw error;
  }

  // Obtener el role_id
  const roleResult = await pool.query('SELECT id FROM roles WHERE nombre = $1', [role]);
  if (roleResult.rows.length === 0) {
    const error = new Error('Rol inválido');
    error.status = 400;
    throw error;
  }

  const roleId = roleResult.rows[0].id;

  // Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Crear el usuario
  const userId = uuidv4();
  await pool.query(
    `INSERT INTO users (id, nombre, email, password_hash, role_id, verificado_email)
     VALUES ($1, $2, $3, $4, $5, false)`,
    [userId, nombre, email, passwordHash, roleId]
  );

  // Enviar el correo de verificación
  await sendVerificationEmail(email);
};

export const loginUserService = async (email, password) => {
  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (userResult.rows.length === 0) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const user = userResult.rows[0];

  if (!user.verificado_email) {
    const error = new Error('Por favor verifique su correo electrónico para continuar');
    error.status = 400;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  // Generar JWT y devolver user sin password para que el controlador maneje la cookie y la respuesta
  const token = await createJwt(user.id);
  const { password_hash, ...userWithoutPassword } = user;

  return { token, userWithoutPassword };
};

export const userVerifyEmail = async (token) => {
  const userResult = await pool.query(
    'UPDATE users SET verificado_email = true WHERE email = $1 RETURNING *',
    [token]
  );
  if (userResult.rowCount === 0) {
    const error = new Error('Usuario no encontrado o token inválido');
    error.status = 404;
    throw error;
  }
};

