/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *         description: "1 activo, 0 inactivo"
 *         example: 1
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [nombre, apellido, nombre_usuario, creado, modificado]
 *         description: "Campo para ordenar resultados"
 *         example: nombre
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: "Dirección de ordenamiento"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Cantidad máxima de registros"
 *         example: 5
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: "Desde qué registro iniciar la paginación"
 *         example: 0
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - nombre_usuario
 *               - password
 *               - tipo_usuario
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Ana"
 *               apellido:
 *                 type: string
 *                 example: "Flores"
 *               nombre_usuario:
 *                 type: string
 *                 example: "anaflor"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               tipo_usuario:
 *                 type: integer
 *                 description: "1 = admin, 2 = empleado, 3 = cliente"
 *                 example: 3
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos o faltantes
 */

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   put:
 *     summary: Modificar un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a modificar
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Ana María"
 *               apellido:
 *                 type: string
 *                 example: "Flores"
 *               nombre_usuario:
 *                 type: string
 *                 example: "anaflor_nuevo"
 *               password:
 *                 type: string
 *                 example: "nuevaClave2025"
 *               tipo_usuario:
 *                 type: integer
 *                 example: 2
 *               activo:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Usuario modificado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   delete:
 *     summary: Eliminar (desactivar) un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         usuario_id:
 *           type: integer
 *           example: 3
 *         nombre:
 *           type: string
 *           example: "Oscar"
 *         apellido:
 *           type: string
 *           example: "Ramirez"
 *         nombre_usuario:
 *           type: string
 *           example: "oscar123"
 *         tipo_usuario:
 *           type: integer
 *           example: 2
 *         activo:
 *           type: integer
 *           example: 1
 *         creado:
 *           type: string
 *           format: date-time
 *           example: "2025-10-19T23:41:50Z"
 *         modificado:
 *           type: string
 *           format: date-time
 *           example: "2025-10-19T23:41:50Z"
 */

