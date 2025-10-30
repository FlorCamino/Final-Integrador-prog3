/**
 * @swagger
 * tags:
 *   name: Informes
 *   description: Endpoints de informes estadísticos (solo accesibles por Administradores).
 */

/**
 * @swagger
 * /informes/estadisticas:
 *   get:
 *     summary: Generar informe estadístico general
 *     tags: [Informes]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Genera un informe estadístico consolidado del sistema, incluyendo **reservas, ingresos, usuarios, servicios más contratados y calificaciones**.  
 *       Los datos se obtienen mediante **procedimientos almacenados (stored procedures)**, con opción de filtrar por rango de fechas.  
 *       <br><br>**Rol requerido:** `Administrador`.
 *     parameters:
 *       - in: query
 *         name: desde
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango (formato `YYYY-MM-DD`). Si no se especifica, se incluyen todos los registros disponibles.
 *         example: 2025-10-01
 *       - in: query
 *         name: hasta
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango (formato `YYYY-MM-DD`). Si no se especifica, se incluyen todos los registros hasta la fecha actual.
 *         example: 2025-10-31
 *     responses:
 *       200:
 *         description: Informe generado correctamente.
 *       400:
 *         description: Parámetros de fecha inválidos o rango incorrecto.
 *       403:
 *         description: Acceso denegado. Solo el rol **Administrador** puede generar informes.
 *       500:
 *         description: Error interno del servidor.
 */
