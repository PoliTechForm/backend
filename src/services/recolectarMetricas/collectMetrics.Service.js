import pool from "../../dataBase/pool.js";

//! RECOLECTA LAS MÉTRICAS DE INICIO DE SESIÓN

export const login_metrics = async (userId, platform = 'web', successful = true) => {
  try {
    await pool.query(
      `INSERT INTO login_metrics (user_id, platform, successful) VALUES ($1, $2, $3)`,
      [userId, platform, successful]
    );
    console.log('Login registrado con éxito');
  } catch (error) {
    console.error('Error guardando login:', error);
    throw error;
  }
};

