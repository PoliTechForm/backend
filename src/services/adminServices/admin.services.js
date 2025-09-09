import pool from "../../dataBase/pool.js";

//! CAMBIA EL ESTADO DE CUENTA DE UN USUARIO (servicio)
export const toggleUserStatusService = async (id) => {
  const result = await pool.query(
    `UPDATE users 
         SET estado_cuenta = CASE 
                              WHEN estado_cuenta = 'activo' THEN 'suspendido' 
                             ELSE 'activo' 
                           END 
         WHERE id = $1 
         RETURNING estado_cuenta`,
    [id]
  );

  if (result.rows.length === 0) {
    const error = new Error("Usuario no encontrado.");
    error.status = 404;
    throw error;
  }

  return result.rows[0].estado_cuenta;
};

//! TRAE LOS REPORTES DE TODOS LOS USUARIOS (servicio) - CORREGIDO
export const getAllReportsService = async () => {
  try {
    const result = await pool.query(
      `SELECT 
               r.nombre,
               r.id,
               r.user_id,
               r.asunto,
               r.description,
               r.created_at,
               u.nombre AS nombre_empleado,
               -- Agregar el role_id 
               u.role_id,
               -- Convertir role_id a texto 
               CASE 
                   WHEN u.role_id = 'ab600be8-4a3a-4b97-a5cb-45ae1c41701a' THEN 'administrador'
                   WHEN u.role_id = 'd594f841-b250-4e95-bf22-776ebd23d579' THEN 'Empleado'
                   WHEN u.role_id = '17c0fc88-e08f-42fe-8d46-7e077968a319' THEN 'ciudadano'
                   ELSE 'Sin definir'
               END AS rol
            FROM reports r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC`
    );
    return result.rows;
  } catch (error) {
    console.error("Error en el servicio", error);
    const err = new Error("Error del servidor al obtener los reportes.");
    err.status = 500;
    throw err;
  }
};
