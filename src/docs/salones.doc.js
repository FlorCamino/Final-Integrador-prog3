/**
 * @swagger
 * tags:
 *   name: Salones
 *   description: API para la gestión de salones de eventos.
 */

/**
 * @swagger
 * /salones:
 *   get:
 *     summary: Listar salones
 *     tags: [Salones]
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
 *           enum: [titulo, importe, capacidad, creado, modificado]
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
 *         description: Lista de salones obtenida correctamente
 */

/**
 * @swagger
 * /salones/{id}:
 *   get:
 *     summary: Obtener un salón por ID
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     description: Roles permitidos: Administrador, Empleado y Cliente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Salón encontrado correctamente
 *       404:
 *         description: No se encontró el salón
 */

/**
 * @swagger
 * /salones:
 *   post:
 *     summary: Crear un nuevo salón
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     description: Roles permitidos: Administrador y Empleado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: "Salón PKES Premium"
 *             direccion: "Av. Siempre Viva 123"
 *             latitud: -31.42
 *             longitud: -64.18
 *             capacidad: 120
 *             importe: 250000
 *     responses:
 *       201:
 *         description: Salón creado correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Rol no autorizado
 */

/**
 * @swagger
 * /salones/{salon_id}:
 *   put:
 *     summary: Modificar un salón existente
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     description: Roles permitidos: Administrador y Empleado.
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             titulo: "Salón PKES Kids"
 *             direccion: "Calle Principal 456"
 *             latitud: -31.43
 *             longitud: -64.19
 *             capacidad: 100
 *             importe: 180000
 *     responses:
 *       200:
 *         description: Salón modificado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: No se encontró el salón
 *       403:
 *         description: Rol no autorizado
 */

/**
 * @swagger
 * /salones/{salon_id}:
 *   delete:
 *     summary: Eliminar (soft delete) un salón
 *     tags: [Salones]
 *     security:
 *       - bearerAuth: []
 *     description: Roles permitidos: Administrador y Empleado.
 *     parameters:
 *       - in: path
 *         name: salon_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Salón eliminado correctamente
 *       404:
 *         description: No se encontró el salón
 *       403:
 *         description: Rol no autorizado
 */
