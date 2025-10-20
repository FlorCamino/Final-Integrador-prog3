/**
 * @swagger
 * tags:
 *   name: Comentarios
 *   description: API para la gestión de comentarios sobre reservas.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comentario:
 *       type: object
 *       required:
 *         - reserva_id
 *         - usuario_id
 *         - comentario
 *       properties:
 *         comentario_id:
 *           type: integer
 *         reserva_id:
 *           type: integer
 *         usuario_id:
 *           type: integer
 *         comentario:
 *           type: string
 *         creado:
 *           type: string
 *           format: date-time
 *         activo:
 *           type: integer
 *       example:
 *         comentario_id: 1
 *         reserva_id: 2
 *         usuario_id: 3
 *         comentario: "El cliente pagó el 50% de la reserva"
 *         creado: "2025-10-19T18:00:00.000Z"
 *         activo: 1
 */

/**
 * @swagger
 * /comentarios/{reserva_id}:
 *   get:
 *     summary: Obtener comentarios por ID de reserva
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentarios obtenidos correctamente.
 */

/**
 * @swagger
 * /comentarios:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comentarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comentario'
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente.
 *       400:
 *         description: Datos inválidos.
 */

/**
 * @swagger
 * /comentarios/{comentario_id}:
 *   delete:
 *     summary: Eliminar (soft delete) un comentario
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: comentario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentario eliminado correctamente.
 */
