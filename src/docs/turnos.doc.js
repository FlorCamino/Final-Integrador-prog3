/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: API para la gestión de turnos de reserva.
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Listar todos los turnos activos
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - turno_id: 1
 *                   orden: 1
 *                   hora_desde: "12:00"
 *                   hora_hasta: "14:00"
 *                   activo: 1
 *                 - turno_id: 2
 *                   orden: 2
 *                   hora_desde: "15:00"
 *                   hora_hasta: "17:00"
 *                   activo: 1
 */

/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a obtener
 *         example: 3
 *     responses:
 *       200:
 *         description: Turno encontrado correctamente
 *         content:
 *           application/json:
 *             example:
 *               turno_id: 3
 *               orden: 3
 *               hora_desde: "18:00"
 *               hora_hasta: "20:00"
 *               activo: 1
 *       404:
 *         description: Turno no encontrado
 */

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             orden: 5
 *             hora_desde: "20:00"
 *             hora_hasta: "23:00"
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 */

/**
 * @swagger
 * /turnos/{id}:
 *   put:
 *     summary: Modificar un turno existente
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a modificar
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             orden: 2
 *             hora_desde: "13:00"
 *             hora_hasta: "15:00"
 *             activo: 1
 *     responses:
 *       200:
 *         description: Turno modificado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       404:
 *         description: Turno no encontrado
 */

/**
 * @swagger
 * /turnos/{id}:
 *   delete:
 *     summary: Eliminar (soft delete) un turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del turno a eliminar
 *         example: 4
 *     responses:
 *       200:
 *         description: Turno eliminado correctamente
 *       404:
 *         description: Turno no encontrado
 */
