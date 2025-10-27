/**
 * @swagger
 * tags:
 *   name: Comentarios
 *   description: API para la gestión de comentarios sobre reservas.
 */

/**
 * @swagger
 * /comentarios/{reserva_id}:
 *   get:
 *     summary: Obtener comentarios por ID de reserva
 *     tags: [Comentarios]
		*     security:
		*       - bearerAuth: []
		*     description: "Roles permitidos: Administrador y Empleado."
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
		*     security:
		*       - bearerAuth: []
		*     description: "Roles permitidos: Administrador y Empleado."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             reserva_id: 2
 *             usuario_id: 3
 *             comentario: "El cliente pagó el 50% de la reserva"
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente.
 *       400:
 *         description: Datos inválidos.
			*       403:
			*         description: Rol no autorizado.
 */

/**
 * @swagger
 * /comentarios/{comentario_id}:
 *   delete:
 *     summary: Eliminar (soft delete) un comentario
 *     tags: [Comentarios]
		*     security:
		*       - bearerAuth: []
		*     description: "Rol requerido: Administrador."
 *     parameters:
 *       - in: path
 *         name: comentario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comentario eliminado correctamente.
			*       403:
			*         description: Rol no autorizado.
 */
