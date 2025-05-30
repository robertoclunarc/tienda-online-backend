import { Pool } from 'pg';
import dotenv from 'dotenv';
//import postgres from 'postgres'

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  /*host: process.env.DB_HOST || 'localhost', 
  database: process.env.DB_DATABASE || 'dbtiendaonline',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',*/
  connectionString: process.env.DB_HOST, 
  ssl: { rejectUnauthorized: false }
  //max: 15, // Máximo de conexiones en el pool
  //idleTimeoutMillis: 30000, // Tiempo máximo que una conexión puede estar inactiva
  //connectionTimeoutMillis: isProduction ? 5000 : 2000,
  //ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});

// Función para probar la conexión
export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log('Conexión BD establecida correctamente');
    client.release();
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error);
    //throw error;
  }
};

/*export const testConnection2 = async (): Promise<void> => {
  try {
    const connectionString = process.env.DB_HOST
    if (connectionString) {
      const sql = postgres(connectionString);
      const result = await sql`SELECT 1 AS test`;
      console.log('DATABASE_URL', process.env.DB_HOST);
      console.log('Conexión 2 con postgres', result);
    }
    
  } catch (error) {
    console.error('Error al conectar a PostgreSQL en test 2:', error);
    //throw error;
  }
};*/

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