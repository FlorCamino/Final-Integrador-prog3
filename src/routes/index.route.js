import { Router } from "express";
import conexionBaseDatos from "../config/db.js";
import enrutadorReservas from "./reservas.route.js";

const enrutador = Router();

/**
 * @swagger
 * tags:
 *   name: Estado
 *   description: Endpoints para verificar el estado de la API y la conexión a la base de datos
 */

/**
 * @swagger
 * /estado:
 *   get:
 *     summary: Verificar si la API está en ejecución
 *     tags: [Estado]
 *     responses:
 *       200:
 *         description: API en ejecución correctamente
 *         content:
 *           application/json:
 *             example:
 *               estado: ok
 *               mensaje: API ejecutándose
 */

enrutador.get("/estado", (_req, res) => {
  res.status(201).json({ estado: "ok", mensaje: "API ejecutándose" });
});

/**
 * @swagger
 * /conexion:
 *   get:
 *     summary: Verificar conexión con la base de datos
 *     tags: [Estado]
 *     responses:
 *       200:
 *         description: Conexión exitosa con la base de datos
 *         content:
 *           application/json:
 *             example:
 *               estado: ok
 *               baseDeDatos: conectada
 *               horaServidor: 2025-02-05T12:34:56.000Z
 *       500:
 *         description: Error en la conexión con la base de datos
 *         content:
 *           application/json:
 *             example:
 *               estado: error
 *               baseDeDatos: desconectada
 *               mensaje: Access denied for user 'root'@'localhost'
 */
enrutador.get("/conexion", async (_req, res) => {
  try {
    const [filas] = await conexionBaseDatos.query("SELECT NOW() AS ahora");
    res.json({
      estado: "ok",
      baseDeDatos: "conectada",
      horaServidor: filas[0].ahora,
    });
  } catch (error) {
    res.status(500).json({
      estado: "error",
      baseDeDatos: "desconectada",
      mensaje: error.message,
    });
  }
});

enrutador.use("/reservas", enrutadorReservas);

export default enrutador;
