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
        error.status = 404; // Se lanza el estado para que el controlador lo use
        throw error;
    }

    return result.rows[0].estado_cuenta;
};

//! TRAE LOS REPORTES DE TODOS LOS USUARIOS (servicio)
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
              u.nombre AS nombre_empleado
            FROM reports r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC`
        );
        return result.rows; 
    } catch (error) {
        console.error("Error en getAllReportsService:", error);
        const err = new Error("Error del servidor al obtener los reportes.");
        err.status = 500; 
        throw err;
    }
};