/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: API generación de reportes de tipo PDF - CSV - EXCEL.
 */

/**
 * @swagger
 * /reportes/reservas/excel:
 *   get:
 *     summary: Generar reporte de reservas en formato Excel
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
		*     description: Rol requerido: Administrador.
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

/**
 * @swagger
 * /reportes/reservas/csv:
 *   get:
		*     summary: Generar reporte de reservas en formato CSV
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
		*     description: Rol requerido: Administrador.
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
 *         description: Archivo CSV generado correctamente
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No hay reservas para exportar
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /reportes/reservas/pdf:
 *   get:
		*     summary: Generar reporte de reservas en formato PDF
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
		*     description: Rol requerido: Administrador.
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
 *         description: Archivo PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No hay reservas para exportar
 *       500:
 *         description: Error interno del servidor
 */