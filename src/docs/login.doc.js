/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: API para el inicio de sesión y validación de usuarios mediante JWT.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     description: >
 *       Permite autenticar a un usuario y obtener un token **JWT** para acceder sa las rutas protegidas del sistema.  
 *       <br><br>
 *       **Roles disponibles:**  
 *       - 1 → Administrador  
 *       - 2 → Empleado  
 *       - 3 → Cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nombre_usuario: "admin@correo.com"
 *             contrasenia: "admin123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Inicio de sesión exitoso"
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 usuario:
 *                   id: 1
 *                   nombre: "Lucía"
 *                   apellido: "Martínez"
 *                   nombre_usuario: "admin@correo.com"
 *                   rol: "administrador"
 *       400:
 *         description: Datos faltantes o inválidos
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /auth/validar:
 *   get:
 *     summary: Validar token JWT
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Verifica si el token JWT enviado en el encabezado `Authorization` sigue siendo válido.
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Token válido"
 *               data:
 *                 id: 1
 *                 nombre_usuario: "admin@correo.com"
 *                 tipo_usuario: 1
 *                 rol: "administrador"
 *                 iat: 1739453200
 *                 exp: 1739539600
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token inválido o expirado
 */
