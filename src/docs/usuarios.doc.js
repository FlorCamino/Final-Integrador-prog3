/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para la gestión de usuarios del sistema.
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
*     description: "Roles permitidos: Administrador y Empleado."
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
 *           enum: [nombre, apellido, nombre_usuario, creado, modificado]
 *         description: Campo por el cual ordenar los resultados
 *         example: nombre
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Dirección del orden
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad máxima de registros
 *         example: 5
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Desde qué registro iniciar la paginación
 *         example: 0
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - usuario_id: 1
 *                   nombre: "Lucas"
 *                   apellido: "Pérez"
 *                   nombre_usuario: "lucasp"
 *                   tipo_usuario: 1
 *                   activo: 1
 *                 - usuario_id: 2
 *                   nombre: "Camila"
 *                   apellido: "Rojas"
 *                   nombre_usuario: "camilar"
 *                   tipo_usuario: 2
 *                   activo: 1
 */

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
*     description: "Roles permitidos: Administrador y Empleado."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Usuario encontrado correctamente
 *         content:
 *           application/json:
 *             example:
 *               usuario_id: 3
 *               nombre: "Camila"
 *               apellido: "Rojas"
 *               nombre_usuario: "camilar"
 *               tipo_usuario: 2
 *               activo: 1
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
*     description: "Rol requerido: Administrador."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre: "Lucas"
 *             apellido: "Pérez"
 *             nombre_usuario: "lucasp"
 *             password: "123456"
 *             tipo_usuario: 3
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       403:
 *         description: Rol no autorizado
 */

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   put:
 *     summary: Modificar un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
*     description: "Rol requerido: Administrador."
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
 *           example:
 *             nombre: "Camila"
 *             apellido: "Rojas"
 *             nombre_usuario: "camilar_mod"
 *             password: "nuevaClave2025"
 *             tipo_usuario: 2
 *             activo: 1
 *     responses:
 *       200:
 *         description: Usuario modificado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: Rol no autorizado
 */

/**
 * @swagger
 * /usuarios/{usuario_id}:
 *   delete:
 *     summary: Eliminar (desactivar) un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
*     description: "Rol requerido: Administrador."
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
 *       403:
 *         description: Rol no autorizado
 */
