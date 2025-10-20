/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Autenticación de usuarios
*/

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión un usuario existente (Cliente, Empleado o Administrador)
 *     tags: [Autenticación]
 *     description: >
 *       Permite autenticar a un usuario y obtener un token JWT para acceder a las rutas protegidas.
 *       <br><br>
 *       **Roles disponibles:**
 *       - 1 → Administrador  
 *       - 2 → Empleado  
 *       - 3 → Cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 description: Correo o nombre de usuario registrado
 *               contrasenia:
 *                 type: string
 *                 description: Contraseña del usuario
 *             required:
 *               - nombre_usuario
 *               - contrasenia
 *           examples:
 *             Administrador:
 *               summary: Ejemplo de login como Administrador
 *               value:
 *                 nombre_usuario: admin@correo.com
 *                 contrasenia: admin123
 *             Empleado:
 *               summary: Ejemplo de login como Empleado
 *               value:
 *                 nombre_usuario: empleado@correo.com
 *                 contrasenia: empleado123
 *             Cliente:
 *               summary: Ejemplo de login como Cliente
 *               value:
 *                 nombre_usuario: cliente@correo.com
 *                 contrasenia: cliente123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       401:
 *         description: Credenciales inválidas (usuario o contraseña incorrectos)
 *       500:
 *         description: Error interno del servidor
 */