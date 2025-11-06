import { ejecutarConsulta } from '../config/db.js';

export default class EncuestasModel {
  async crearEncuesta({ reserva_id, usuario_id, puntuacion, comentario }) {
    const query = `
      INSERT INTO encuestas (reserva_id, usuario_id, puntuacion, comentario)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await ejecutarConsulta(query, [
      reserva_id,
      usuario_id,
      puntuacion,
      comentario?.trim() || null,
    ]);
    return result.insertId;
  }

  async obtenerEncuestas() {
    const query = `
      SELECT 
        e.encuesta_id,
        e.reserva_id,
        e.usuario_id,
        e.puntuacion,
        e.comentario,
        e.activo,
        e.creado,
        e.modificado,
        r.tematica,
        r.fecha_reserva
      FROM encuestas e
      INNER JOIN reservas r ON e.reserva_id = r.reserva_id
      WHERE e.activo = 1
      ORDER BY e.creado DESC
    `;
    const [rows] = await ejecutarConsulta(query);
    return rows;
  }

  async obtenerPorId(encuesta_id) {
    const query = `
      SELECT *
      FROM encuestas
      WHERE encuesta_id = ? AND activo = 1
      LIMIT 1
    `;
    const [rows] = await ejecutarConsulta(query, [encuesta_id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async obtenerPorReserva(reserva_id) {
    const query = `
      SELECT 
        e.encuesta_id,
        e.reserva_id,
        e.usuario_id,
        e.puntuacion,
        e.comentario,
        e.activo,
        e.creado,
        e.modificado,
        r.usuario_id AS usuario_reserva,
        r.fecha_reserva
      FROM encuestas e
      INNER JOIN reservas r ON e.reserva_id = r.reserva_id
      WHERE e.reserva_id = ? AND e.activo = 1
      LIMIT 1
    `;
    const [rows] = await ejecutarConsulta(query, [reserva_id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async obtenerEncuestasPorUsuario(usuario_id) {
    const query = `
      SELECT 
        e.encuesta_id,
        e.reserva_id,
        e.usuario_id,
        e.puntuacion,
        e.comentario,
        e.activo,
        e.creado,
        e.modificado,
        r.tematica,
        r.fecha_reserva
      FROM encuestas e
      INNER JOIN reservas r ON e.reserva_id = r.reserva_id
      WHERE r.usuario_id = ? AND e.activo = 1
      ORDER BY e.creado DESC
    `;
    const [rows] = await ejecutarConsulta(query, [usuario_id]);
    return rows;
  }

  async eliminarEncuesta(encuesta_id) {
    const query = `
      UPDATE encuestas
      SET activo = 0, modificado = CURRENT_TIMESTAMP
      WHERE encuesta_id = ?
    `;
    const [result] = await ejecutarConsulta(query, [encuesta_id]);
    return result.affectedRows > 0;
  }
}
