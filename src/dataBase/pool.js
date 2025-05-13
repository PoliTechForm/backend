import dotenv from 'dotenv';
import pkg from 'pg';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from '../env/env.js';

dotenv.config();
const { Pool } = pkg;

// Configurar el pool de conexiones con las variables de entorno
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Deshabilitar la validación SSL si es necesario
  },
});

export default pool;
