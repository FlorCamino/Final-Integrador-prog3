import conexion from '../config/db.js'; 

export default class Servicio {

  buscarTodosServicios = async ({ limit, offset, estado, sort, order }) => {
    const conn = await conexion();

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

    await conn.end();

    return { rows };
  }

  buscarServicioPorId = async (id) => {
    const conn = await conexion();
    const [rows] = await conexion.query('SELECT * FROM servicios WHERE servicio_id = ?', [id]);ç
    await conn.end();
    return rows.length > 0 ? rows[0] : null;
  }


  modificarServicioPorId = async (servicio_id, { descripcion, importe }) => {
    const conn = await conexion();
    const query = 'UPDATE servicios SET descripcion = ?, importe = ? WHERE servicio_id = ?';
    const [result] = await conexion.query(query, [descripcion, importe, servicio_id]);
    await conn.end();
    return result;
  };

  crearServicio = async ({ descripcion, importe }) => {
    const conn = await conexion();
    const [result] = await conexion.query(
      `INSERT INTO servicios (descripcion, importe, activo) VALUES (?, ?, 1)`,
      [descripcion, importe]
    );
    await conn.end();
    return {
      servicio_id: result.insertId,
      descripcion,
      importe,
      activo: 1
    };
  }

  eliminarServicioPorId = async (servicio_id) => {
    const conn = await conexion();
    const query = 'UPDATE servicios SET activo= 0 WHERE servicio_id = ?';
    const [result] = await conexion.query(query, [servicio_id]);
    await conn.end();
    return result;
  }
}

