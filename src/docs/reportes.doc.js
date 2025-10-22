/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: API generación de reportes de tipo PDF - CSV - EXCEL.
 */

/**
 * @swagger
 * /reportes/reservas:
 *   get:
 *     summary: Generar reporte de reservas en formato Excel
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango (YYYY-MM-DD)
 *         example: 2025-10-01
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango (YYYY-MM-DD)
 *         example: 2025-10-31
 *     responses:
 *       200:
 *         description: Archivo Excel generado correctamente
 *       404:
 *         description: No hay reservas para exportar
 *       500:
 *         description: Error interno del servidor
 */
