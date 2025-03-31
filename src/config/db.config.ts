import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';
// Configuración del pool de conexiones a PostgreSQL
const pool = new Pool({
  //user: process.env.DB_USER || 'postgres',
  connectionString: process.env.DB_HOST || 'localhost',
  //database: process.env.DB_DATABASE || 'dbtiendaonline',
  //password: process.env.DB_PASSWORD || 'postgres',
  //port: parseInt(process.env.DB_PORT || '5432'),
  max: 30, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // Tiempo máximo que una conexión puede estar inactiva
  connectionTimeoutMillis: isProduction ? 5000 : 2000,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});

// Función para probar la conexión
export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('Conexión BD establecida correctamente');
    client.release();
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error);
    throw error;
  }
};

export default pool;
/*
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dbtiendaonline',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para probar la conexión
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
};

export default pool;
*/