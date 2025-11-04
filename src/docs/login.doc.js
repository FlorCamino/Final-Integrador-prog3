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
 *     summary: Iniciar sesión según rol
 *     tags: [Autenticación]
 *     description: >
 *       Permite autenticar a un usuario y obtener un token **JWT** para acceder a las rutas protegidas del sistema.  
 *       **Roles disponibles:**  
 *       - Administrador   
 *       - Empleado 
 *       - Cliente   
 *       <br><br>
 *       Una vez autenticado, deberá incluir el token en el encabezado de las peticiones protegidas:
 *       ```
 *       Authorization: Bearer <token>
 *       ```
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - title: Administrador
 *                 description: Credenciales para el rol Administrador
 *                 properties:
 *                   nombre_usuario:
 *                     type: string
 *                     example: admin@correo.com
 *                   contrasenia:
 *                     type: string
 *                     example: admin123
 *               - title: Empleado
 *                 description: Credenciales para el rol Empleado
 *                 properties:
 *                   nombre_usuario:
 *                     type: string
 *                     example: empleado@correo.com
 *                   contrasenia:
 *                     type: string
 *                     example: empleado123
 *               - title: Cliente
 *                 description: Credenciales para el rol Cliente
 *                 properties:
 *                   nombre_usuario:
 *                     type: string
 *                     example: cliente@correo.com
 *                   contrasenia:
 *                     type: string
 *                     example: cliente123
 *           examples:
 *             Administrador:
 *               summary: Login como Administrador
 *               value:
 *                 nombre_usuario: "admin@correo.com"
 *                 contrasenia: "admin123"
 *             Empleado:
 *               summary: Login como Empleado
 *               value:
 *                 nombre_usuario: "empleado@correo.com"
 *                 contrasenia: "empleado123"
 *             Cliente:
 *               summary: Login como Cliente
 *               value:
 *                 nombre_usuario: "cliente@correo.com"
 *                 contrasenia: "cliente123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Datos faltantes o inválidos
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error interno del servidor
 */
