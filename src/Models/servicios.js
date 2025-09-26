import { conexion } from '../config/db.js';

export default class Servicio {
  
  buscarTodosServicios = async ({ limit, offset, estado, sort, order }) => {
    let baseQuery = 'FROM servicios WHERE 1=1';
    const params = [];  
    if (estado !== undefined) {
      baseQuery += ' AND activo = ?';
      params.push(estado);
    }
    const validSortFields = ['importe', 'descripcion', 'creado', 'modificado'];
    const sortField = validSortFields.includes(sort) ? sort : null;

    const direction = (typeof order === 'string' && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
    let query = `SELECT * ${baseQuery}`;
    if (sortField) query += ` ORDER BY ${sortField} ${direction}`;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const [rows] = await conexion.query(query, params);
    return { rows };
  }
  buscarServicioPorId = async (id) => {
    const [rows] = await conexion.query('SELECT * FROM servicios WHERE servicio_id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  crearServicio = async ({ descripcion, importe }) => {
    const [result] = await conexion.query(
      `INSERT INTO servicios (descripcion, importe, activo) VALUES (?, ?, 1)`,
      [descripcion, importe]
    );
    return {
      servicio_id: result.insertId,
      descripcion,
      importe,
      activo: 1
    };
  }

  eliminarServicioPorId = async (servicio_id) => {
    const query = 'UPDATE servicios SET activo= 0 WHERE servicio_id = ?';
    const [result] = await conexion.query(query, [servicio_id]);
    return result;
  }
}

