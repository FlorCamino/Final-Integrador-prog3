import express from 'express';
import ServiciosController from '../../controllers/servicios.controller.js';

const serviciosController = new ServiciosController();

const router = express.Router();

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Listar servicios
 *     tags: [Servicios]
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *         description: "1 activo, 0 inactivo"
 *         example: 1
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [importe, descripcion, creado, modificado]
 *         description: "Campo para ordenar"
 *         example: importe
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: "Dirección de orden"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 5
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         example: 0
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
router.get('/', serviciosController.obtenerServicios);

/**
 * @swagger
 * /servicios/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', serviciosController.obtenerServicioPorId);

/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crear un servicio
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               importe:
 *                 type: number
 *           example:
 *             descripcion: "Servicio de inflable infantil"
 *             importe: 12500
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', serviciosController.crearServicio);

/**
 * @swagger
 * /servicios/modificar/{servicio_id}:
 *   put:
 *     summary: Modificar un servicio existente
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del servicio a modificar
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Servicio de animación infantil"
 *               importe:
 *                 type: number
 *                 example: 15000
 *     responses:
 *       200:
 *         description: Servicio modificado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.put('/modificar/:servicio_id', serviciosController.modificarServicio)

/**
 * @swagger
 * /servicios/eliminar/{servicio_id}:
 *   delete:
 *     summary: Eliminar un servicio
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: servicio_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Servicio eliminado correctamente
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/eliminar/:servicio_id', serviciosController.eliminarServicio);

export default router;

