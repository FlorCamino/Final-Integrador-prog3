/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: API para la gestión de reservas de eventos (con soporte para imágenes).
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Listar reservas
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Roles permitidos: **Administrador, Empleado y Cliente**.  
 *       - Los **Clientes** solo pueden ver sus propias reservas.
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
 *           enum: [fecha_reserva, salon_id, turno_id, tematica, importe_salon, importe_total, creado, modificado]
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
 *     description: |
 *       Roles permitidos: **Administrador, Empleado y Cliente**.  
 *       - Los **Clientes** solo pueden ver sus propias reservas.
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
 *     summary: Crear una nueva reserva (con imagen opcional del cumpleañero)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Roles permitidos: **Administrador y Cliente**.  
 *       - Para **Administradores**: incluir `usuario_id` en el body.  
 *       - Para **Clientes**: se usa automáticamente el usuario del token.  
 *       - Los servicios deben enviarse como JSON plano en formato string.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_reserva
 *               - salon_id
 *               - turno_id
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-20"
 *               salon_id:
 *                 type: integer
 *                 example: 1
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               turno_id:
 *                 type: integer
 *                 example: 2
 *               tematica:
 *                 type: string
 *                 example: "Spiderman"
 *               importe_salon:
 *                 type: number
 *                 example: 25000
 *               importe_total:
 *                 type: number
 *                 example: 40000
 *               servicios:
 *                 type: string
 *                 description: "JSON string de servicios. Ejemplo: '[{\"servicio_id\":1,\"importe\":5000}]'"
 *                 example: '[{"servicio_id":1,"importe":5000}]'
 *               foto_cumpleaniero:
 *                 type: string
 *                 format: binary
 *                 description: Imagen opcional del cumpleañero
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
 *     summary: Modificar una reserva existente (puede reemplazar la imagen)
 *     tags: [Reservas]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Roles permitidos: **Administrador**.  
 *       Permite reemplazar la foto del cumpleañero si se envía una nueva.  
 *       Los servicios deben enviarse como JSON string.
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-30"
 *               salon_id:
 *                 type: integer
 *                 example: 5
 *               usuario_id:
 *                 type: integer
 *                 example: 2
 *               turno_id:
 *                 type: integer
 *                 example: 3
 *               tematica:
 *                 type: string
 *                 example: "Mario Bros"
 *               importe_salon:
 *                 type: number
 *                 example: 50000
 *               importe_total:
 *                 type: number
 *                 example: 55000
 *               servicios:
 *                 type: string
 *                 description: "JSON string de servicios actualizados. Ejemplo: '[{\"servicio_id\":2,\"importe\":5000}]'"
 *                 example: '[{"servicio_id":2,"importe":5000}]'
 *               foto_cumpleaniero:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen del cumpleañero (opcional)
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
 *     description: |
 *       Roles permitidos: **Administrador**.  
 *       Además desactiva la reserva y elimina la imagen asociada del servidor (si existe).
 *     parameters:
 *       - in: path
 *         name: reserva_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva eliminada correctamente
 *       404:
 *         description: No se encontró la reserva
 *       403:
 *         description: Rol no autorizado
 */
