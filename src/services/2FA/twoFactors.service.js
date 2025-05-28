import pool from "../../dataBase/pool.js";
import { EMAIL_ENTERPRISE } from "../../env/env.js";
import { transporter } from "../verify.Email.Service.js";

export const generateAndSend2FACode = async (email, userId) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutos

  // Guardar token en la DB
  await pool.query(
    `INSERT INTO login_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, code, expiresAt]
  );

  // Enviar email con código
  await send2FACodeEmail(email, code);
};

export const send2FACodeEmail = async (email, code) => {
  const mailOptions = {
    from: EMAIL_ENTERPRISE,
    to: email,
    subject: 'Tu código de verificación 2FA',
    html: `<p>Tu código para iniciar sesión es:</p>
           <h2>${code}</h2>
           <p>Este código expira en 10 minutos.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error al enviar correo 2FA:', err.message);
    throw new Error('No se pudo enviar el código 2FA');
  }
};

export const enable2FAService = async (userId) => {
  try {
    await pool.query(
      `UPDATE users SET two_factor_enabled = true WHERE id = $1`,
      [userId]
    );
  } catch (error) {
    console.error('Error al habilitar 2FA en la base de datos:', error.message);
    throw new Error('No se pudo habilitar 2FA');
  }
};
