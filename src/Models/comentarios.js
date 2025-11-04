import { obtenerPool } from '../config/db.js';

export default class Comentarios {
  async obtenerPorReserva(reserva_id, conn = null) {
    const connection = conn || (await obtenerPool().getConnection());
    try {
      const [rows] = await connection.query(
        `SELECT c.*, u.nombre, u.apellido
         FROM comentarios_reservas c
         JOIN usuarios u ON c.usuario_id = u.usuario_id
         WHERE c.reserva_id = ? AND c.activo = 1
         ORDER BY c.creado DESC`,
        [reserva_id]
      );
      if (!conn) connection.release();
      return rows;
    } catch (err) {
      if (!conn) connection.release();
      throw err;
    }
  }

  async crear({ reserva_id, usuario_id, comentario }, conn = null) {
    const connection = conn || (await obtenerPool().getConnection());
    try {
      const [result] = await connection.query(
        `INSERT INTO comentarios_reservas 
         (reserva_id, usuario_id, comentario, activo) 
         VALUES (?, ?, ?, 1)`,
        [reserva_id, usuario_id, comentario]
      );
      if (!conn) connection.release();
      return {
        comentario_id: result.insertId,
        reserva_id,
        usuario_id,
        comentario,
      };
    } catch (err) {
      if (!conn) connection.release();
      throw err;
    }
  }

  async eliminar(comentario_id, conn = null) {
    const connection = conn || (await obtenerPool().getConnection());
    try {
      const [result] = await connection.query(
        `UPDATE comentarios_reservas 
         SET activo = 0, modificado = CURRENT_TIMESTAMP 
         WHERE comentario_id = ?`,
        [comentario_id]
      );
      if (!conn) connection.release();
      return result;
    } catch (err) {
      if (!conn) connection.release();
      throw err;
    }
  }

  async desactivarPorReserva(reserva_id, conn = null) {
    const connection = conn || (await obtenerPool().getConnection());
    try {
      await connection.query(
        `UPDATE comentarios_reservas 
         SET activo = 0, modificado = CURRENT_TIMESTAMP 
         WHERE reserva_id = ?`,
        [reserva_id]
      );
      if (!conn) connection.release();
    } catch (err) {
      if (!conn) connection.release();
      throw err;
    }
  }
}
