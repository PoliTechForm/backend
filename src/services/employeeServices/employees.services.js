import pool from "../../dataBase/pool.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import sendVerificationEmail from "../verify.Email.Service.js";

export const createUserService = async (
  user,
  nombre,
  dni,
  email,
  password,
  role = "ciudadano"
) => {
  const result = await pool.query(
    `SELECT r.nombre FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`,
    [user.id]
  );

  if (result.rows.length === 0) {
    const error = new Error("Usuario no encontrado.");
    error.status = 404;
    throw error;
  }

  const rolUsuario = result.rows[0].nombre;
  if (rolUsuario !== "administrador" && rolUsuario !== "Empleado") {
    const error = new Error("No tienes acceso a esa función.");
    error.status = 403;
    throw error;
  }

  const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (userExists.rows.length > 0) {
    const error = new Error("El correo ya está registrado.");
    error.status = 409;
    throw error;
  }

  const roleResult = await pool.query(
    "SELECT id FROM roles WHERE nombre = $1",
    [role]
  );
  if (roleResult.rows.length === 0) {
    const error = new Error("Rol inválido.");
    error.status = 400;
    throw error;
  }

  const roleId = roleResult.rows[0].id;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const userId = uuidv4();

  await pool.query(
    `INSERT INTO users (id, nombre, dni, email, password_hash, role_id, verificado_email)
         VALUES ($1, $2, $3, $4, $5, $6, false)`,
    [userId, nombre, dni, email, passwordHash, roleId]
  );

  await sendVerificationEmail(email);
};

export const generateReportService = async (user, asunto, description) => {
  const nombre = user.nombre;

  if (!asunto || !description) {
    const error = new Error("Asunto y descripción son obligatorios.");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    ` SELECT r.nombre FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`,
    [user.id]
  );

  if (result.rows.length === 0) {
    const error = new Error("Usuario no encontrado.");
    error.status = 404;
    throw error;
  }

  if (result.rows[0].nombre !== "Empleado") {
    const error = new Error("No tienes acceso a esa función.");
    error.status = 403;
    throw error;
  }

  await pool.query(
    "INSERT INTO reports (user_id, nombre, asunto, description) VALUES ($1, $2, $3, $4)",
    [user.id, nombre, asunto, description]
  );
};

export const updateInfoUserService = async (
  user,
  id,
  nombre,
  email,
  password
) => {
  const result = await pool.query(
    ` SELECT r.nombre FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`,
    [user.id]
  );
  if (result.rows.length === 0) {
    const error = new Error("Usuario no encontrado.");
    error.status = 404;
    throw error;
  }

  if (result.rows[0].nombre !== "Empleado") {
    const error = new Error("No tienes acceso a esa función.");
    error.status = 403;
    throw error;
  }

  if (!id) {
    const error = new Error("Id no encontrado.");
    error.status = 400;
    throw error;
  }

  const usuario = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (usuario.rows.length === 0) {
    const error = new Error("Usuario no encontrado.");
    error.status = 404;
    throw error;
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
    const error = new Error("No se proporcionaron campos para actualizar.");
    error.status = 400;
    throw error;
  }

  values.push(id);

  const query = `
            UPDATE users
            SET ${updates.join(", ")}
            WHERE id = $${count}
        `;

  await pool.query(query, values);
};

export const deleteUserService = async (id) => {
  if (!id) {
    const error = new Error("Id de usuario no proporcionado.");
    error.status = 400;
    throw error;
  }

  try {
    const result = await pool.query('DELETE FROM public.users WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      const error = new Error("El usuario con esa id no fue encontrado.");
      error.status = 404;
      throw error;
    }
  } catch (err) {
    console.error('Error en deleteUserService:', err);
    // Puedes lanzar un error personalizado o el mismo error:
    throw err;
  }
};



