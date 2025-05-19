import sendVerificationEmail from "./verify.Email.Service.js";
import { RECAPTCHA_SECRET_KEY } from "../env/env.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import pool from "../dataBase/pool.js";
import { createJwt } from "../jwt/createJwt/createJwt.js";

export const registerUserService = async (nombre, email, password, role = "ciudadano", recaptchaToken) => {
  // Verificar captcha
  const captchaResponse = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    null,
    {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: recaptchaToken,
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

  // Aquí se evalúa si tiene activado el 2FA
  if (user.two_factor_enabled) {  
  return {
    twoFactorRequired: true,
    userId: user.id,
    email: user.email,
  };
}

  // Si no tiene 2FA, continúa con login normal
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

//Verifica el código 2FA
export const userVerifyTwoFactorService = async (userId, code) => {
  const result = await pool.query(
    `SELECT * FROM login_tokens
     WHERE user_id = $1 AND token = $2 AND expires_at > now()`,
    [userId, code]
  );

  if (result.rows.length === 0) {
    throw new Error('Código 2FA inválido o expirado');
  }

  // Eliminar el token para evitar reuso
  await pool.query(
    `DELETE FROM login_tokens WHERE user_id = $1 AND token = $2`,
    [userId, code]
  );

  // Generar token JWT y retornarlo
  const token = await createJwt(userId);
  return token;
} 

export const changeUserPasswordService = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !newPassword) {
      throw new Error('Se requieren ambas contraseñas');
    }

    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = result.rows[0];

    // Verificar que la contraseña actual sea correcta
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw new Error('La contraseña actual es incorrecta');
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Actualizar la contraseña en la base de datos
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId]);
}

