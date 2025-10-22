import { ejecutarConsulta } from '../config/db.js';

export default class Comentarios {
  async obtenerPorReserva(reserva_id) {
    const [rows] = await ejecutarConsulta(
      `SELECT c.*, u.nombre, u.apellido
       FROM comentarios_reservas c
       JOIN usuarios u ON c.usuario_id = u.usuario_id
       WHERE c.reserva_id = ? AND c.activo = 1
       ORDER BY c.creado DESC`,
      [reserva_id]
    );
    return rows;
  }

  async crear({ reserva_id, usuario_id, comentario }) {
    const [result] = await ejecutarConsulta(
      'INSERT INTO comentarios_reservas (reserva_id, usuario_id, comentario) VALUES (?, ?, ?)',
      [reserva_id, usuario_id, comentario]
    );
    return { comentario_id: result.insertId, reserva_id, usuario_id, comentario };
  }

  async eliminar(comentario_id) {
    const [result] = await ejecutarConsulta(
      'UPDATE comentarios_reservas SET activo = 0 WHERE comentario_id = ?',
      [comentario_id]
    );
    return result;
  }
}
