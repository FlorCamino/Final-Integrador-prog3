import { ejecutarConsulta } from '../config/db.js';

export default class Reservas {
  buscarTodasReservas = async ({ limit, offset, estado, sort, order }) => {

    let baseQuery = 'FROM reservas WHERE 1=1 ';
    const params = [];

    if (estado !== undefined) {
      baseQuery += ' AND activo = ?';
      params.push(estado);
    }

    const validSortFields = ['fecha_reserva', 'salon_id' , 'turno_id' , 'tematica' , 'importe_salon', 'importe_total', 'creado', 'modificado'];
    const sortField = validSortFields.includes(sort) ? sort : null;

    const direction = (typeof order === 'string' && order.toLocaleUpperCase() === 'DESC') ? 'DESC' : 'ASC';
    let query = `SELECT *${baseQuery}`;
    if (sortField) query += ` ORDER BY ${sortField} ${direction}`;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [rows] = await ejecutarConsulta(query, params);
    return { rows };
  };

  buscarReservasPorUsuario = async (usuario_id, { id, limit, offset, estado, sort, order }) => {
    let baseQuery = 'FROM reservas WHERE usuario_id = ?';
    const params = [usuario_id];
    
    if (id) {
      baseQuery += ' AND reserva_id = ?';
      params.push(id);
    }

    if (estado !== undefined) {
      baseQuery += ' AND activo = ?';
      params.push(estado);
    }

    const validSortFields = ['fecha_reserva', 'salon_id' , 'turno_id' , 'tematica' , 'importe_salon', 'importe_total', 'creado', 'modificado'];
    const sortField = validSortFields.includes(sort) ? sort : null;

    const direction = (typeof order === 'string' && order.toLocaleUpperCase() === 'DESC') ? 'DESC' : 'ASC';
    let query = `SELECT *${baseQuery}`;
    if (sortField) query += ` ORDER BY ${sortField} ${direction}`;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [rows] = await ejecutarConsulta(query, params);
    return { rows };
  };

  buscarReservaPorId = async (id) => {
    const [rows] = await ejecutarConsulta('SELECT * FROM reservas WHERE reserva_id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  };

  modificarReservaPorId = async (reserva_id, datos) => {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total
    } = datos;

    const query = `UPDATE reservas SET fecha_reserva = ?, salon_id = ?, usuario_id = ?, turno_id = ?, foto_cumpleaniero = ?, tematica = ?, importe_salon = ?, importe_total = ? WHERE reserva_id = ?`;
    const [result] = await ejecutarConsulta(query, [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, reserva_id]);
    return result;
  };

  crearReserva = async ({fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total}) => {
    const [result] = await ejecutarConsulta(
      `INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]
    );

    return {
      reserva_id: result.insertId,
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
      activo: 1
    };
  };

  eliminarReservaPorId = async (reserva_id) => {
    const query = 'UPDATE reservas SET activo = 0 WHERE reserva_id = ?';
    const [result] = await ejecutarConsulta(query, [reserva_id]);
    return result;
  };

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
        GROUP_CONCAT(DISTINCT se.descripcion ORDER BY se.descripcion SEPARATOR ', ') AS descripcion_servicio,
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
