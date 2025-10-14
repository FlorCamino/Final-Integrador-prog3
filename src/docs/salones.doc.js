/**
 * @swagger
 * /salones:
 *   get:
 *     summary: Listar salones
 *     tags: [Salones]
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
 *           enum: [titulo, importe, capacidad, creado, modificado]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
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
 *         description: Lista de salones
 */

/**
 * @swagger
 * /salones/{id}:
 *   get:
 *     summary: Obtener un salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Salón encontrado
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /salones:
 *   post:
 *     summary: Crear un salón
 *     tags: [Salones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo: { type: string }
 *               direccion: { type: string }
 *               latitud: { type: number }
 *               longitud: { type: number }
 *               capacidad: { type: integer }
 *               importe: { type: number }
 *     responses:
 *       201:
 *         description: Salón creado correctamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /salones/modificar/{salon_id}:
 *   put:
 *     summary: Modificar un salón existente
 *     tags: [Salones]
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
 *           schema:
 *             type: object
 *             properties:
 *               titulo: { type: string }
 *               direccion: { type: string }
 *               latitud: { type: number }
 *               longitud: { type: number }
 *               capacidad: { type: integer }
 *               importe: { type: number }
 *     responses:
 *       200:
 *         description: Salón modificado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: No encontrado
 */

/**
 * @swagger
 * /salones/eliminar/{salon_id}:
 *   delete:
 *     summary: Eliminar un salón
 *     tags: [Salones]
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
 *         description: No encontrado
 */

// End of salones docs
