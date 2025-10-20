import conexion from '../config/db.js';

export default class Comentarios {
  async obtenerPorReserva(reserva_id) {
    const conn = await conexion();
    const [rows] = await conn.query(
      `SELECT c.*, u.nombre, u.apellido
       FROM comentarios_reservas c
       JOIN usuarios u ON c.usuario_id = u.usuario_id
       WHERE c.reserva_id = ? AND c.activo = 1
       ORDER BY c.creado DESC`,
      [reserva_id]
    );
    await conn.end();
    return rows;
  }

  async crear({ reserva_id, usuario_id, comentario }) {
    const conn = await conexion();
    const [result] = await conn.query(
      'INSERT INTO comentarios_reservas (reserva_id, usuario_id, comentario) VALUES (?, ?, ?)',
      [reserva_id, usuario_id, comentario]
    );
    await conn.end();
    return { comentario_id: result.insertId, reserva_id, usuario_id, comentario };
  }

  async eliminar(comentario_id) {
    const conn = await conexion();
    await conn.query('UPDATE comentarios_reservas SET activo = 0 WHERE comentario_id = ?', [comentario_id]);
    await conn.end();
  }
}
