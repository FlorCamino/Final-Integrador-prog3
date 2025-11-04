import { ejecutarConsulta } from '../config/db.js';

export default class Turnos {
  async buscarTodosTurnos({ limit, offset, estado, sort, order }) {
    let baseQuery = 'FROM turnos WHERE 1=1';
    const params = [];

    if (estado !== undefined) {
      baseQuery += ' AND activo = ?';
      params.push(estado);
    }

    const validSortFields = ['orden', 'hora_desde', 'hora_hasta', 'creado', 'modificado'];
    const sortField = validSortFields.includes(sort) ? sort : null;
    const direction = (typeof order === 'string' && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';

    let query = `SELECT * ${baseQuery}`;
    if (sortField) query += ` ORDER BY ${sortField} ${direction}`;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await ejecutarConsulta(query, params);
    return { rows };
  }

  async buscarTurnoPorId(turno_id) {
    const [rows] = await ejecutarConsulta('SELECT * FROM turnos WHERE turno_id = ?', [turno_id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async crearTurno({ orden, hora_desde, hora_hasta }) {
    const [result] = await ejecutarConsulta(
      `INSERT INTO turnos (orden, hora_desde, hora_hasta, activo) VALUES (?, ?, ?, 1)`,
      [orden, hora_desde, hora_hasta]
    );
    return {
      turno_id: result.insertId,
      orden,
      hora_desde,
      hora_hasta,
      activo: 1
    };
  }

  async modificarTurnoPorId(turno_id, { orden, hora_desde, hora_hasta }) {
    const campos = [];
    const valores = [];

    if (orden !== undefined) {
      campos.push('orden = ?');
      valores.push(orden);
    }
    if (hora_desde !== undefined) {
      campos.push('hora_desde = ?');
      valores.push(hora_desde);
    }
    if (hora_hasta !== undefined) {
      campos.push('hora_hasta = ?');
      valores.push(hora_hasta);
    }

    if (campos.length === 0) {
      return { affectedRows: 0 };
    }

    const query = `
      UPDATE turnos 
      SET ${campos.join(', ')}, modificado = CURRENT_TIMESTAMP 
      WHERE turno_id = ?`;
    valores.push(turno_id);
    const [result] = await ejecutarConsulta(query, valores);
    return result;
  }

  async eliminarTurnoPorId(turno_id) {
    const [result] = await ejecutarConsulta('UPDATE turnos SET activo = 0 WHERE turno_id = ?', [turno_id]);
    return result;
  }
}
