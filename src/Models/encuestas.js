import { ejecutarConsulta } from '../config/db.js';

export default class EncuestasModel {
  async crearEncuesta({ reserva_id, puntuacion, comentario }) {
    const query = `
      INSERT INTO encuestas (reserva_id, puntuacion, comentario)
      VALUES (?, ?, ?)
    `;
    const [result] = await ejecutarConsulta(query, [reserva_id, puntuacion, comentario]);
    return result.insertId;
  }

  async obtenerEncuestas() {
    const [rows] = await ejecutarConsulta(
      `SELECT e.*, r.tematica, r.fecha_reserva 
       FROM encuestas e
       JOIN reservas r ON e.reserva_id = r.reserva_id
       ORDER BY e.creado DESC`
    );
    return rows;
  }

  async obtenerPorReserva(reserva_id) {
    const [rows] = await ejecutarConsulta(
      `SELECT * FROM encuestas WHERE reserva_id = ?`,
      [reserva_id]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}
