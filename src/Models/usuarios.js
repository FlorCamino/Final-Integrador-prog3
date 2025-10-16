import conexion from "../config/db";
import bcrypt from "bcrypt";

export default class Usuarios {
    async buscarTodosUsuarios({ limit, offset, estado, sort, order }) {
    let query = 'SELECT * FROM usuarios';
    const params = [];
    const conditions = [];
    if (estado !== undefined) {
      conditions.push('activo = ?');
      params.push(estado);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    const validSortFields = ['nombre', 'email', 'creado', 'modificado'];
    const sortField = validSortFields.includes(sort) ? sort : null;
    const direction = (typeof order === 'string' && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
    if (sortField) {
      query += ` ORDER BY ${sortField} ${direction}`;
    }
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    const conn = await conexion();
    const [rows] = await conn.query(query, params);
    await conn.end();
    return { rows };
  }
    async buscarUsuarioPorId(usuario_id) {
    const conn = await conexion();
    const [rows] = await conn.query('SELECT * FROM usuarios WHERE usuario_id = ?', [usuario_id]);
    await conn.end();
    return rows.length > 0 ? rows[0] : null;
  }
    async crearUsuario({ nombre, email, password, tipo_usuario }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await conexion();
    const [result] = await conn.query(
      `INSERT INTO usuarios (nombre, email, password, tipo_usuario, activo) VALUES (?, ?, ?, ?, 1)`,
      [nombre, email, hashedPassword, tipo_usuario]
    );
    await conn.end();
    return {
        usuario_id: result.insertId,
        nombre,
        email,
        tipo_usuario,
        activo: 1
    };
  }
    async modificarUsuarioPorId(usuario_id, { nombre, email, password, tipo_usuario, activo }) {
    const conn = await conexion();
    let query = 'UPDATE usuarios SET ';
    const params = [];
    const updates = [];
    if (nombre !== undefined) {
      updates.push('nombre = ?');
      params.push(nombre);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      params.push(hashedPassword);
    }
    if (tipo_usuario !== undefined) {
      updates.push('tipo_usuario = ?');
      params.push(tipo_usuario);
    }
    if (activo !== undefined) {
      updates.push('activo = ?');
      params.push(activo);
    }
    if (updates.length === 0) {
      await conn.end();
      return { affectedRows: 0 };
    }
    query += updates.join(', ') + ', modificado = CURRENT_TIMESTAMP WHERE usuario_id = ?';
    params.push(usuario_id);
    const [result] = await conn.query(query, params);
    await conn.end();
    return result;
  }
    async eliminarUsuarioPorId(usuario_id) {
    const conn = await conexion();
    const [result] = await conn.query('UPDATE usuarios SET activo = 0 WHERE usuario_id = ?', [usuario_id]);
    await conn.end();
    return result;
  }
}





