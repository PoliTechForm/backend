import dotenv from 'dotenv';
import pkg from 'pg';

// Cargar variables de entorno primero
dotenv.config();

const { Pool } = pkg;


// Configurar el pool de conexiones con las variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true',
});

export default pool;