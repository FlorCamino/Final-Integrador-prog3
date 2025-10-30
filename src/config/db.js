import mysql from 'mysql2/promise';

process.loadEnvFile();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z',
});


(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos MySQL establecida correctamente.');
    connection.release();
  } catch (error) {
    console.error('Error al conectar con la base de datos MySQL:', error.message);
  }
})();

export async function ejecutarConsulta(query, params = []) {
  try {
    const [rows, fields] = await pool.query(query, params);
    return [rows, fields];
  } catch (error) {
    console.error('Error en ejecutarConsulta:', error.message);
    throw error;
  }
}

export function obtenerPool() {
  return pool;
}

export default pool;
