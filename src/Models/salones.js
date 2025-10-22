import conexion from '../config/db.js';

export default class Salones {
  async buscarTodosSalones({ limit, offset, estado, sort, order }) {
    let query = 'SELECT * FROM salones';
    const params = [];

    if (estado !== undefined) {
      query += ' WHERE activo = ?';
      params.push(estado);
    }

    if (sort) {
      const validSortFields = ['titulo', 'importe', 'capacidad', 'creado', 'modificado'];
      if (validSortFields.includes(sort.toLowerCase())) {
        query += ` ORDER BY ${sort} ${order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
      }
    }

    if (limit !== undefined && offset !== undefined) {
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
    }

    const conn = await conexion();
    const [rows] = await conn.query(query, params);
    await conn.end();
    return { rows };
  }


  async buscarSalonPorId(id) {
    const conn = await conexion();
    const [rows] = await conn.query('SELECT * FROM salones WHERE salon_id = ?', [id]);
    await conn.end();
    return rows[0];
  }

  async crearSalon({ titulo, direccion, latitud, longitud, capacidad, importe }) {
    const conn = await conexion();
    const [result] = await conn.query(
      `INSERT INTO salones (titulo, direccion, latitud, longitud, capacidad, importe, activo)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [titulo, direccion, latitud, longitud, capacidad, importe]
    );
    await conn.end();
    return { salon_id: result.insertId, titulo, direccion, latitud, longitud, capacidad, importe, activo: 1 };
  }

  async modificarSalonPorId(salon_id, datos) {
    const campos = [];
    const valores = [];

    for (const [key, value] of Object.entries(datos)) {
      // 🔹 ignoramos undefined o null
      if (value !== undefined && value !== null) {
        campos.push(`${key} = ?`);
        valores.push(value);
      }
    }

    // 🔹 si no se enviaron campos válidos, no hacemos nada
    if (campos.length === 0) {
      return { affectedRows: 0, message: 'No se enviaron campos para actualizar.' };
    }

    valores.push(salon_id);

    const conn = await conexion();
    const [result] = await conn.query(
      `UPDATE salones SET ${campos.join(', ')}, modificado = CURRENT_TIMESTAMP WHERE salon_id = ?`,
      valores
    );
    await conn.end();
    return result;
  }

  async eliminarSalonPorId(salon_id) {
    const conn = await conexion();
    const [result] = await conn.query('UPDATE salones SET activo = 0 WHERE salon_id = ?', [salon_id]);
    await conn.end();
    return result;
  }
}
