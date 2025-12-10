/**
 * Configuración de la conexión a MySQL usando Knex.js (query builder)
 */

import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

// Configurar instancia de Knex con los datos de conexión
const db = knex({
  client: 'mysql2', // Driver de MySQL
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vivero_db',
    port: process.env.DB_PORT || 3306
  }
});

/**
 * Verifica la conexión a la base de datos al iniciar el servidor
 */
const testConnection = async () => {
  try {
    // Query simple para verificar conexión
    await db.raw('SELECT 1');
    console.log('Conexión exitosa a MySQL con Knex');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
    // Terminar el proceso si no hay conexión
    process.exit(1);
  }
};

export { db, testConnection };
