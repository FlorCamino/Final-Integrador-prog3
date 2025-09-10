import { Router } from "express";
import { RepositorioReservas } from "../repositories/reservas.repository.js";
import { ServicioReservas } from "../services/reservas.service.js";
import { ControladorReservas } from "../controllers/reservas.controller.js";
import { validarReservaCreacion, validarReservaActualizacion } from "../middlewares/reservas.validator.js";
import { validarResultado } from "../middlewares/validacion.resultado.js";

const enrutador = Router();

const repositorioReservas = new RepositorioReservas();
const servicioReservas = new ServicioReservas(repositorioReservas);
const controladorReservas = new ControladorReservas(servicioReservas);

enrutador.get("/", controladorReservas.obtenerTodas);
enrutador.get("/:id", controladorReservas.obtenerPorId);
enrutador.post("/", validarReservaCreacion, validarResultado, controladorReservas.crear);
enrutador.put("/:id", validarReservaActualizacion, validarResultado, controladorReservas.actualizar);
enrutador.delete("/:id", controladorReservas.eliminar);

export default enrutador;
