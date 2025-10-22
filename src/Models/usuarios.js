import e from 'express';
import { ejecutarConsulta } from '../config/db.js';
import bcrypt from "bcrypt";

export default class Usuarios {
  async buscarTodosUsuarios({ limit = 10, offset = 0, estado, sort, order } = {}) {
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

      const [rows] = await ejecutarConsulta(query, params);
      return rows;
  }

  async buscarUsuarioPorId(usuario_id) {
      const [rows] = await ejecutarConsulta(
        `SELECT usuario_id, nombre, apellido, nombre_usuario, tipo_usuario, activo, creado, modificado
         FROM usuarios WHERE usuario_id = ?`,
        [usuario_id]
      );
      return rows[0] || null;
  }

  async crearUsuario({ nombre, apellido, nombre_usuario, password, tipo_usuario }) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await ejecutarConsulta(
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
  }

  async modificarUsuarioPorId(usuario_id, { nombre, apellido, nombre_usuario, password, tipo_usuario, activo }) {
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

      const [result] = await ejecutarConsulta(query, params);
      return result;
  }

  async eliminarUsuarioPorId(usuario_id) {
      const [result] = await ejecutarConsulta(
        "UPDATE usuarios SET activo = 0, modificado = CURRENT_TIMESTAMP WHERE usuario_id = ?",
        [usuario_id]
      );
      return result;
  }

  async buscarUsuarioPorNombreUsuario(nombre_usuario) {
    const [rows] = await ejecutarConsulta("SELECT * FROM usuarios WHERE nombre_usuario = ?", [nombre_usuario]);
    return rows[0] || null;
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
