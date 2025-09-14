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

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Endpoints para gestionar reservas
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Reservas]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Cantidad máxima de reservas a devolver
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [reserva_id, fecha_reserva, creado, modificado, importe_total]
 *         required: false
 *         description: Campo por el que se ordenarán los resultados
 *       - in: query
 *         name: orderDir
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Dirección del ordenamiento (ascendente o descendente)
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
enrutador.get("/", controladorReservas.obtenerTodas);

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Obtener una reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Detalles de la reserva
 *       404:
 *         description: Reserva no encontrada
 */
enrutador.get("/:id", controladorReservas.obtenerPorId);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 example: 1
 *               salonId:
 *                 type: integer
 *                 example: 1
 *               turnoId:
 *                 type: integer
 *                 example: 1
 *               fechaReserva:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-07"
 *               tematica:
 *                 type: string
 *                 example: "River"
 *               importeSalon:
 *                 type: number
 *                 example: 15000
 *               importeTotal:
 *                 type: number
 *                 example: 20000
 *               activo:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *       409:
 *         description: Horario ocupado
 */
enrutador.post("/", validarReservaCreacion, validarResultado, controladorReservas.crear);

/**
 * @swagger
 * /reservas/editar/{id}:
 *   put:
 *     summary: Actualizar parcialmente una reserva existente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la reserva a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 example: 1
 *               salonId:
 *                 type: integer
 *                 example: 2
 *               turnoId:
 *                 type: integer
 *                 example: 1
 *               fechaReserva:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-15"
 *               tematica:
 *                 type: string
 *                 example: "Cumpleaños actualizado"
 *               importeSalon:
 *                 type: number
 *                 example: 18000
 *               importeTotal:
 *                 type: number
 *                 example: 25000
 *               activo:
 *                 type: integer
 *                 example: 1
 *           example:
 *             tematica: "Cumpleaños actualizado"
 *             fechaReserva: "2025-02-20"
 *     responses:
 *       200:
 *         description: Reserva actualizada correctamente
 *       404:
 *         description: Reserva no encontrada
 */

enrutador.put("/editar/:id", validarReservaActualizacion, validarResultado, controladorReservas.actualizar);

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Reservas]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Cantidad máxima de reservas a devolver
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [reserva_id, fecha_reserva, tematica, importe_total]
 *         required: false
 *         description: Campo por el que se ordenarán los resultados
 *       - in: query
 *         name: orderDir
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Dirección del ordenamiento (ascendente o descendente)
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
enrutador.delete("/eliminar/:id", controladorReservas.eliminar);

export default enrutador;
