import { pool } from '../config/db.js';

export async function obtenerTodosServicios({ limit, offset, estado, sort, order }) {
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

  const [rows] = await pool.query(query, params);

  return { rows };
}