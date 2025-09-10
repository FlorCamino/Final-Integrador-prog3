import { Router } from "express";
import conexionBaseDatos from "../config/db.js";
import enrutadorReservas from "./reservas.route.js";

const enrutador = Router();

enrutador.get("/estado", (_req, res) => {
  res.status(201).json({ estado: "ok", mensaje: "API ejecutándose" });
});

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
