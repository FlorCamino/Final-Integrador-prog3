/**
 * @swagger
 * tags:
 *   name: Informes
 *   description: Endpoints para la generación de informes estadísticos del sistema (solo accesibles por Administradores).
 */

/**
 * @swagger
 * /informes/estadisticas:
 *   get:
 *     summary: Generar informe estadístico general del sistema
 *     tags: [Informes]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Genera un **informe estadístico consolidado** del sistema, incluyendo:
 *       - Reservas y sus montos totales.
 *       - Ingresos por periodo.
 *       - Usuarios registrados.
 *       - Servicios más contratados.
 *       - Calificaciones y comentarios recientes.  
 *
 *       Los datos se obtienen mediante **procedimientos almacenados (Stored Procedures)**, con opción de filtrar por rango de fechas.
 *
 *       <br><br>**Rol requerido:** `Administrador`.
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango (formato `YYYY-MM-DD`). Si no se especifica, se incluirán todos los registros disponibles.
 *         example: 2025-10-01
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango (formato `YYYY-MM-DD`). Si no se especifica, se incluirán todos los registros hasta la fecha actual.
 *         example: 2025-10-31
 *     responses:
 *       200:
 *         description: Informe estadístico generado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReservas:
 *                   type: integer
 *                   example: 128
 *                 ingresosTotales:
 *                   type: number
 *                   format: float
 *                   example: 459000
 *                 serviciosMasContratados:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Catering", "Animación", "Fotografía"]
 *                 promedioCalificaciones:
 *                   type: number
 *                   format: float
 *                   example: 4.6
 *       400:
 *         description: Parámetros de fecha inválidos o rango incorrecto.
 *       403:
 *         description: Acceso denegado. Solo el rol Administrador puede generar informes.
 *       404:
 *         description: No se encontraron datos en el rango de fechas especificado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /informes/excel:
 *   get:
 *     summary: Generar informe estadístico en formato Excel
 *     tags: [Informes]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Genera un informe estadístico completo del sistema (reservas, usuarios, servicios y comentarios)
 *       utilizando procedimientos almacenados (**Stored Procedures**) con filtros opcionales por rango de fechas.
 *       <br><br>**Rol requerido:** `Administrador`.
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
 *         description: Archivo Excel generado correctamente.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Parámetros de fecha inválidos o rango incorrecto.
 *       403:
 *         description: Acceso denegado. Solo el rol Administrador puede generar informes.
 *       404:
 *         description: No hay datos disponibles para el rango de fechas especificado.
 *       500:
 *         description: Error interno del servidor.
 */
