import mysql from "mysql2/promise";
import { entorno } from "./env.js"; 

const conexionBaseDatos = mysql.createPool({
  host: entorno.BD_HOST,
  port: entorno.BD_PUERTO,
  user: entorno.BD_USUARIO,
  password: entorno.BD_CLAVE,
  database: entorno.BD_NOMBRE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default conexionBaseDatos;
