/**
 * @swagger
 * tags:
 *   name: Informes
 *   description: API para la generacion de informes y estadísticas
 */

/**
 * @swagger
 * /informes/estadisticas:
 *   get:
 *     summary: Obtiene informe general del sistema
 *     tags: [Informes]
 *     responses:
 *       200:
 *         description: Informe general generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservasPorSalon:
 *                   type: array
 *                 reservasPorUsuario:
 *                   type: array
 *                 resumenReservas:
 *                   type: object
 *                 usuariosPorTipo:
 *                   type: array
 *                 salones:
 *                   type: array
 *                 comentariosPorReserva:
 *                   type: array
 */

