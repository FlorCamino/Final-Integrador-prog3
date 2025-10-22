import { ejecutarConsulta } from '../config/db.js';

export default class Reservas {
  async obtenerReportePorRango(desde, hasta) {
    const query = `
      SELECT 
        r.reserva_id,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        r.fecha_reserva,
        CONCAT(t.hora_desde, ' - ', t.hora_hasta) AS turno,
        r.tematica,
        s.titulo AS salon,
        r.importe_salon,
        se.descripcion AS descripcion_servicio,
        COALESCE(SUM(se.importe), 0) AS importe_servicios,
        (r.importe_salon + COALESCE(SUM(se.importe), 0)) AS costo_total
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN turnos t ON r.turno_id = t.turno_id
      LEFT JOIN reservas_servicios rs ON r.reserva_id = rs.reserva_id
      LEFT JOIN servicios se ON se.servicio_id = rs.servicio_id
      WHERE r.activo = 1
        AND r.fecha_reserva BETWEEN ? AND ?
      GROUP BY r.reserva_id, s.titulo, u.nombre, u.apellido, r.tematica, r.fecha_reserva, t.hora_desde, t.hora_hasta
      ORDER BY r.reserva_id, s.titulo
    `;

    const [rows] = await ejecutarConsulta(query, [desde, hasta]);
    return rows;
  }
}
