import { Router } from 'express';
import * as serviciosController from '../controllers/servicios.controller.js';

const router = Router();

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
router.get('/:id', serviciosController.getById);

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
 *             descripcion: "Servicio de internet"
 *             importe: 1500
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', serviciosController.crearServicio);

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
router.delete('/eliminar/:servicio_id', serviciosController.eliminarServicios);

export default router;

