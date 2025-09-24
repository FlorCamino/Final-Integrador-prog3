import { Router } from 'express';
import { obtenerServicios } from '../controllers/servicios.controller.js';
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
 *         schema: { type: integer }
 *         description: "1 activo, 0 inactivo"
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [importe, descripcion, creado, modificado] }
 *         description: "Campo para ordenar"
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: asc }
 *         description: "Dirección de orden"
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, default: 0 }
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
router.get('/', obtenerServicios);
/**
 * @swagger
 * /servicios/{id}:
 *   get:
 *     summary: Obtener un servicio por su ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico del servicio a obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK - Servicio encontrado y devuelto.
 *         
 *       404:
 *         description: Not Found - No se encontró el servicio con el ID especificado.
 *       400:
 *         description: Bad Request - El ID proporcionado no es válido.
 */
router.get('/:id', serviciosController.getById);

export default router;
