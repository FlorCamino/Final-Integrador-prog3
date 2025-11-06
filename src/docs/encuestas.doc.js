/**
 * @swagger
 * tags:
 *   - name: Encuestas
 *     description: Gestión de encuestas de satisfacción posteriores a las reservas
 */

/**
 * @swagger
 * /encuestas:
 *   post:
 *     summary: Registrar una nueva encuesta de satisfacción
 *     tags: [Encuestas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             reserva_id: 5
 *             puntuacion: 4
 *             comentario: "Excelente atención y organización."
 *     responses:
 *       201:
 *         description: Encuesta creada correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               mensaje: "Encuesta creada correctamente"
 *               data:
 *                 id: 15
 *       400:
 *         description: Error de validación o encuesta antes de la fecha del evento
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               mensaje: "La encuesta solo puede completarse después del evento."
 *       409:
 *         description: Encuesta duplicada para una misma reserva
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               mensaje: "Ya existe una encuesta para esta reserva."

 *   get:
 *     summary: Listar todas las encuestas registradas
 *     tags: [Encuestas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de encuestas obtenido correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               total: 2
 *               data:
 *                 - encuesta_id: 1
 *                   reserva_id: 10
 *                   usuario_id: 3
 *                   puntuacion: 5
 *                   comentario: "Excelente servicio"
 *                   activo: 1
 *                   creado: "2025-09-12T11:25:00Z"
 *                   tematica: "Cumpleaños Frozen"
 *                   fecha_reserva: "2025-08-22"
 *                 - encuesta_id: 2
 *                   reserva_id: 11
 *                   usuario_id: 5
 *                   puntuacion: 4
 *                   comentario: "Muy buena organización"
 *                   activo: 1
 *                   creado: "2025-09-14T15:40:00Z"
 *                   tematica: "Fiesta del Espacio"

 * /encuestas/{reserva_id}:
 *   get:
 *     summary: Obtener la encuesta asociada a una reserva específica
 *     tags: [Encuestas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: reserva_id
 *         in: path
 *         required: true
 *         description: ID de la reserva asociada
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Encuesta encontrada
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               data:
 *                 encuesta_id: 15
 *                 reserva_id: 5
 *                 usuario_id: 2
 *                 puntuacion: 4
 *                 comentario: "Muy buena atención"
 *                 activo: 1
 *                 creado: "2025-09-15T10:00:00Z"
 *       404:
 *         description: No existe encuesta para esta reserva
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               mensaje: "No se encontró encuesta para esta reserva."

 * /encuestas/{encuesta_id}:
 *   delete:
 *     summary: Eliminar una encuesta existente (borrado lógico)
 *     tags: [Encuestas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: encuesta_id
 *         in: path
 *         required: true
 *         description: ID de la encuesta a eliminar
 *         schema:
 *           type: integer
 *           example: 15
 *     responses:
 *       200:
 *         description: Encuesta eliminada correctamente
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               mensaje: "Encuesta eliminada correctamente"
 *       403:
 *         description: El usuario no tiene permiso para eliminar esta encuesta
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               mensaje: "No tiene permisos para eliminar esta encuesta."
 *       404:
 *         description: No se encontró la encuesta especificada
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               mensaje: "No se encontró la encuesta indicada."
 */
