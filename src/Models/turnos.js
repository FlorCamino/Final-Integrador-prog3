import conexion from '../config/db.js';

export default class Turnos {
  async buscarTodosTurnos({ limit, offset, estado, sort, order }) {
    const conn = await conexion();
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

    const [rows] = await conn.query(query, params);
    await conn.end();
    return { rows };
  }

  async buscarTurnoPorId(turno_id) {
    const conn = await conexion();
    const [rows] = await conn.query('SELECT * FROM turnos WHERE turno_id = ?', [turno_id]);
    await conn.end();
    return rows.length > 0 ? rows[0] : null;
  }

  async crearTurno({ orden, hora_desde, hora_hasta }) {
    const conn = await conexion();
    const [result] = await conn.query(
      `INSERT INTO turnos (orden, hora_desde, hora_hasta, activo) VALUES (?, ?, ?, 1)`,
      [orden, hora_desde, hora_hasta]
    );
    await conn.end();
    return {
      turno_id: result.insertId,
      orden,
      hora_desde,
      hora_hasta,
      activo: 1
    };
  }

  async modificarTurnoPorId(turno_id, { orden, hora_desde, hora_hasta }) {
    const conn = await conexion();
    const query = `
      UPDATE turnos 
      SET orden = ?, hora_desde = ?, hora_hasta = ?, modificado = CURRENT_TIMESTAMP 
      WHERE turno_id = ?`;
    const [result] = await conn.query(query, [orden, hora_desde, hora_hasta, turno_id]);
    await conn.end();
    return result;
  }

  async eliminarTurnoPorId(turno_id) {
    const conn = await conexion();
    const [result] = await conn.query('UPDATE turnos SET activo = 0 WHERE turno_id = ?', [turno_id]);
    await conn.end();
    return result;
  }
}
