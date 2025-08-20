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
  role = "ciudadano", 
  sexo,
  location_id
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
    `INSERT INTO users (id, nombre, dni, email, password_hash, role_id, verificado_email, sexo, location_id)
         VALUES ($1, $2, $3, $4, $5, $6, false, $7, $8)`,
    [userId, nombre, dni, email, passwordHash, roleId, sexo, location_id]
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
    if(!id){
        const error = new Error("Id de usuario no proporcionado.");
        error.status = 400;
        throw error;
        }
    const result = await pool.query('DELETE FROM public.users WHERE id = $1', [id])
        if(result.rowCount === 0) {
    const error = new Error("El usuario con esa id no fue encontrado.");
        error.status = 404;
        throw error;
        }    
}

export const updateEmployeeUserService = async (userRequester, id, { nombre, email, dni, password, role_id }) => {
  if (!id) {
    const error = new Error("ID no encontrado");
    error.statusCode = 400;
    throw error;
  }

  const userToUpdateResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  if (userToUpdateResult.rows.length === 0) {
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }
  const userToUpdate = userToUpdateResult.rows[0];

  if (dni && dni !== userToUpdate.dni) {
    const dniCheck = await pool.query('SELECT id FROM users WHERE dni = $1 AND id != $2', [dni, id]);
    if (dniCheck.rows.length > 0) {
      const error = new Error("El DNI ya está registrado en otro usuario");
      error.statusCode = 409;
      throw error;
    }
  }

  if (email && email !== userToUpdate.email) {
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, id]);
    if (emailCheck.rows.length > 0) {
      const error = new Error("El correo electrónico ya está registrado en otro usuario");
      error.statusCode = 409;
      throw error;
    }
  }

  let updates = [];
  let values = [];
  let count = 1;

  const isAdmin = userRequester.role_id === 'ab600be8-4a3a-4b97-a5cb-45ae1c41701a';

  if (nombre) {
    updates.push(`nombre = $${count++}`);
    values.push(nombre);
  }
  if (email) {
    updates.push(`email = $${count++}`);
    values.push(email);
  }
  if (dni !== undefined) {
    updates.push(`dni = $${count++}`);
    values.push(dni);
  }
  if (password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    updates.push(`password_hash = $${count++}`);
    values.push(hashedPassword);
  }
  if (role_id && isAdmin) {
    const roleCheck = await pool.query('SELECT id FROM roles WHERE id = $1', [role_id]);
    if (roleCheck.rows.length === 0) {
      const error = new Error("Rol no válido");
      error.statusCode = 404;
      throw error;
    }
    updates.push(`role_id = $${count++}`);
    values.push(role_id);
  }
  if (updates.length === 0) {
    const error = new Error("No se proporcionaron campos para actualizar");
    error.statusCode = 400;
    throw error;
  }

  values.push(id);

  const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${count}
  `;

  await pool.query(query, values);

  return "Usuario actualizado exitosamente";
};


