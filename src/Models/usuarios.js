import conexion from "../config/db.js";
import bcrypt from "bcrypt";

export default class Usuarios {
  async buscarTodosUsuarios({ limit = 10, offset = 0, estado, sort, order } = {}) {
    const conn = await conexion();
    try {
      let query = `
        SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, activo, creado, modificado
        FROM usuarios
      `;
      const params = [];
      const conditions = [];

      if (estado !== undefined) {
        conditions.push("activo = ?");
        params.push(estado);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      const validSortFields = ["nombre", "apellido", "nombre_usuario", "creado", "modificado"];
      const sortField = validSortFields.includes(sort) ? sort : "creado";
      const direction = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";

      query += ` ORDER BY ${sortField} ${direction} LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));

      const [rows] = await conn.query(query, params);
      return rows;
    } finally {
      await conn.end();
    }
  }

  async buscarUsuarioPorId(usuario_id) {
    const conn = await conexion();
    try {
      const [rows] = await conn.query(
        `SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, activo, creado, modificado
         FROM usuarios WHERE usuario_id = ?`,
        [usuario_id]
      );
      return rows[0] || null;
    } finally {
      await conn.end();
    }
  }

  async crearUsuario({ nombre, apellido, nombre_usuario, password, tipo_usuario }) {
    const conn = await conexion();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await conn.query(
        `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, activo, creado, modificado)
         VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [nombre, apellido, nombre_usuario, hashedPassword, tipo_usuario]
      );

      return {
        usuario_id: result.insertId,
        nombre,
        apellido,
        nombre_usuario,
        tipo_usuario,
        activo: 1,
      };
    } finally {
      await conn.end();
    }
  }

  async modificarUsuarioPorId(usuario_id, { nombre, apellido, nombre_usuario, password, tipo_usuario, activo }) {
    const conn = await conexion();
    try {
      const updates = [];
      const params = [];

      if (nombre !== undefined) {
        updates.push("nombre = ?");
        params.push(nombre);
      }
      if (apellido !== undefined) {
        updates.push("apellido = ?");
        params.push(apellido);
      }
      if (nombre_usuario !== undefined) {
        updates.push("nombre_usuario = ?");
        params.push(nombre_usuario);
      }
      if (password !== undefined) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push("contrasenia = ?");
        params.push(hashedPassword);
      }
      if (tipo_usuario !== undefined) {
        updates.push("tipo_usuario = ?");
        params.push(tipo_usuario);
      }
      if (activo !== undefined) {
        updates.push("activo = ?");
        params.push(activo);
      }

      if (updates.length === 0) return { affectedRows: 0 };

      const query = `
        UPDATE usuarios 
        SET ${updates.join(", ")}, modificado = CURRENT_TIMESTAMP 
        WHERE usuario_id = ?
      `;
      params.push(usuario_id);

      const [result] = await conn.query(query, params);
      return result;
    } finally {
      await conn.end();
    }
  }

  async eliminarUsuarioPorId(usuario_id) {
    const conn = await conexion();
    try {
      const [result] = await conn.query(
        "UPDATE usuarios SET activo = 0, modificado = CURRENT_TIMESTAMP WHERE usuario_id = ?",
        [usuario_id]
      );
      return result;
    } finally {
      await conn.end();
    }
  }

  async buscarUsuarioPorNombreUsuario(nombre_usuario) {
    const conn = await conexion();
    try {
      const [rows] = await conn.query("SELECT * FROM usuarios WHERE nombre_usuario = ?", [nombre_usuario]);
      return rows[0] || null;
    } finally {
      await conn.end();
    }
  }

  async validarCredenciales(nombre_usuario, password) {
    const usuario = await this.buscarUsuarioPorNombreUsuario(nombre_usuario);
    if (!usuario) return null;

    const isValid = await bcrypt.compare(password, usuario.contrasenia);
    if (!isValid) return null;

    delete usuario.contrasenia;
    return usuario;
  }
}
