import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function ejecutarConsulta(query, params = []) {
  const [rows, fields] = await pool.query(query, params);
  return [rows, fields];
}

export function obtenerPool() {
  return pool;
}

export default pool;
