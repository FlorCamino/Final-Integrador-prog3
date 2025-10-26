/**
 * @swagger
 * tags:
 *   name: Servicios
 *   description: API para la gestión de servicios disponibles.
 */

/**
 * @swagger
 * /servicios:
 *   get:
 *     summary: Listar servicios
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     description: Roles permitidos: Administrador, Empleado y Cliente.
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *         description: "1 = activo, 0 = inactivo"
 *         example: 1
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [importe, descripcion, creado, modificado]
 *         description: Campo por el cual ordenar los resultados
 *         example: importe
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Dirección del orden
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad máxima de resultados a devolver
 *         example: 5
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Cantidad de resultados a omitir (para paginación)
 *         example: 0
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida correctamente
 */

/**
 * @swagger
 * /servicios/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     description: Roles permitidos: Administrador, Empleado y Cliente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Servicio encontrado correctamente
 *       404:
 *         description: Servicio no encontrado
 */

/**
 * @swagger
 * /servicios:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     description: Roles permitidos: Administrador y Empleado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             descripcion: "Servicio de inflable infantil"
 *             importe: 12500
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Rol no autorizado
 */

/**
 * @swagger
 * /servicios/{servicio_id}:
 *   put:
 *     summary: Modificar un servicio existente
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     description: Roles permitidos: Administrador y Empleado.
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
 *           example:
 *             descripcion: "Servicio de animación infantil"
 *             importe: 15000
 *     responses:
 *       200:
 *         description: Servicio modificado correctamente
 *       400:
 *         description: Datos inválidos o incompletos
 *       404:
 *         description: Servicio no encontrado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /servicios/{servicio_id}:
 *   delete:
 *     summary: Eliminar (soft delete) un servicio
 *     tags: [Servicios]
 *     security:
 *       - bearerAuth: []
 *     description: Roles permitidos: Administrador y Empleado.
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
 *       403:
 *         description: Rol no autorizado
 */
