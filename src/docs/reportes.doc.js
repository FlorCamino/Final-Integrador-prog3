/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Endpoints para generar reportes de reservas en formato PDF, CSV o Excel.
 */

/**
 * @swagger
 * /reportes/reservas/excel:
 *   get:
 *     summary: Generar reporte de reservas en formato Excel
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     description: Genera un reporte general de reservas en formato Excel.  
 *       **Rol requerido:** Administrador.
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
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
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
 * /reportes/reservas/csv:
 *   get:
 *     summary: Generar reporte de reservas en formato CSV
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     description: Genera un reporte general de reservas en formato CSV.  
 *       **Rol requerido:** Administrador.
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
 *     description: Genera un reporte general de reservas en formato PDF.  
 *       **Rol requerido:** Administrador.
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

/**
 * @swagger
 * /reportes/reservas/pdf/{id}:
 *   get:
 *     summary: Generar comprobante PDF de una reserva individual
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     description: Genera un comprobante PDF detallado de una reserva específica.  
 *       **Rol requerido:** Administrador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva a exportar
 *         example: 87
 *     responses:
 *       200:
 *         description: Comprobante PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error interno del servidor
 */
