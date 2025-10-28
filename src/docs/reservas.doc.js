/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: API para la gestión de reservas de eventos.
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Listar reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: "Roles permitidos: Administrador, Empleado y Cliente. los clientes solo pueden ver sus propias reservas."
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *           description: "1 = activo, 0 = inactivo"
 *           example: 1
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [fecha_reserva, salon_id , turno_id , tematica , importe_salon, importe_total, creado, modificado]
 *         description: Campo por el cual ordenar los resultados
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Orden ascendente o descendente
  *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Lista de reservas obtenida correctamente
 */

/**
 * @swagger
 * /reservas/{reserva_id}:
 *   get:
 *     summary: Obtener reserva por ID
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: "Roles permitidos: Administrador, Empleado y Cliente. El cliente solo tiene acceso a sus propias reservas."
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva encontrada correctamente
 *       404:
 *         description: No se encontró la reserva
 *       403:
 *         description: Rol no autorizado
 */

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: "Roles permitidos: Administrador y Cliente. \n\nPara Administradores: Incluír 'usuario_id' en el body.\nPara Clientes: NO incluir 'usuario_id' (se utiliza automáticamente el propio)"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *               salon_id:
 *                 type: integer
 *               usuario_id:
 *                 type: integer
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     servicio_id:
 *                       type: integer
 *                     importe:
 *                       type: number
 *           example:
 *             fecha_reserva: "2025-10-28"
 *             salon_id: 1
 *             turno_id: 2
 *             usuario_id: 1
 *             foto_cumpleaniero: "http://www.ejemplo.com/imagen.png"
 *             tematica: "Gatitos"
 *             importe_salon: 17000
 *             importe_total: 27000
 *             servicios:
 *               - servicio_id: 1
 *                 importe: 7000
 *               - servicio_id: 3
 *                 importe: 3000
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Rol no autorizado
 */

/**
 * @swagger
 * /reservas/{reserva_id}:
 *   put:
 *     summary: Modificar una reserva existente
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: "Roles permitidos: Administrador."
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             fecha_reserva: "2025-10-30"
 *             salon_id: 5
 *             turno_id: 2
 *             usuario_id: 3
 *             foto_cumpleaniero: "http://www.ejemplo.com/foto.jpg"
 *             tematica: "Autos"
 *             importe_salon: 50000
 *             importe_total: 55000
 *             servicios:
 *               - servicio_id: 4
 *                 importe: 5000
 *     responses:
 *       200:
 *         description: Reserva modificada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: No se encontró la reserva
 *       403:
 *         description: Rol no autorizado
 */

/**
 * @swagger
 * /reservas/{reserva_id}:
 *   delete:
 *     summary: Eliminar (soft delete) una reserva
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: "Roles permitidos: Administrador."
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva eliminado correctamente
 *       404:
 *         description: No se encontró la reserva
 *       403:
 *         description: Rol no autorizado
 */