import dotenv from 'dotenv';
import pkg from 'pg';
import { DB_USER, DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT } from '../env/env.js';

// Cargar variables de entorno primero
dotenv.config();

const { Pool } = pkg;

// Configurar el pool de conexiones con las variables de entorno
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
  ssl: process.env.DB_SSL === 'true',
});

export default pool;