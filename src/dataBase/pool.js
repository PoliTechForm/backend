require('dotenv').config(); // Cargar las variables del archivo .env

const { Pool } = require('pg');

// Configurar el pool de conexiones con las variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Deshabilitar la validación SSL si es necesario
  },
});

module.exports = pool;
