/**
 * @swagger
 * tags:
 *   name: Turnos
 *   description: API para la gestión de turnos de reserva.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         turno_id:
 *           type: integer
 *           description: ID autogenerado del turno.
 *         orden:
 *           type: integer
 *           description: Número de orden del turno.
 *         hora_desde:
 *           type: string
 *           format: time
 *           description: Hora de inicio del turno (HH:MM).
 *         hora_hasta:
 *           type: string
 *           format: time
 *           description: Hora de fin del turno (HH:MM).
 *         activo:
 *           type: integer
 *           description: Estado del turno (1=activo, 0=inactivo).
 *       example:
 *         turno_id: 1
 *         orden: 1
 *         hora_desde: "12:00:00"
 *         hora_hasta: "14:00:00"
 *         activo: 1
 */

/**
 * @swagger
 * /turnos:
 *   get:
 *     summary: Listar todos los turnos activos
 *     tags: [Turnos]
 *     responses:
 *       200:
 *         description: Lista de turnos obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Turno'
 */

/**
 * @swagger
 * /turnos/{id}:
 *   get:
 *     summary: Obtener un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del turno a obtener.
 *     responses:
 *       200:
 *         description: Turno encontrado.
 *       404:
 *         description: Turno no encontrado.
 */

/**
 * @swagger
 * /turnos:
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orden
 *               - hora_desde
 *               - hora_hasta
 *             properties:
 *               orden:
 *                 type: integer
 *               hora_desde:
 *                 type: string
 *                 format: time
 *               hora_hasta:
 *                 type: string
 *                 format: time
 *             example:
 *               orden: 5
 *               hora_desde: "20:00"
 *               hora_hasta: "23:00"
 *     responses:
 *       201:
 *         description: Turno creado exitosamente.
 */

/**
 * @swagger
 * /turnos/modificar/{id}:
 *   put:
 *     summary: Actualizar un turno existente
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del turno a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turno'
 *     responses:
 *       200:
 *         description: Turno actualizado correctamente.
 */

/**
 * @swagger
 * /turnos/eliminar/{id}:
 *   delete:
 *     summary: Eliminar (soft delete) un turno por su ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del turno a eliminar.
 *     responses:
 *       200:
 *         description: Turno eliminado correctamente.
 */