import { obtenerPool } from '../config/db.js';

export default class ReservasServicios {

  async crearReservaConServicios(reserva_id, servicios, conn = null) {
    const connection = conn || (await obtenerPool().getConnection());
    try {
      for (const servicio of servicios) {
        const sql = `
          INSERT INTO reservas_servicios (reserva_id, servicio_id, importe, activo)
          VALUES (?, ?, ?, 1);
        `;
        await connection.query(sql, [reserva_id, servicio.servicio_id, servicio.importe]);
      }
      if (!conn) connection.release();
      return true;
    } catch (err) {
      if (!conn) connection.release();
      throw err;
    }
  }

  async agregarServiciosDeReserva(reserva_id, nuevosServicios, conn = null) {
    const connection = conn || (await obtenerPool().getConnection());
    try {
      for (const servicio of nuevosServicios) {
        const sql = `
          INSERT INTO reservas_servicios (reserva_id, servicio_id, importe, activo)
          VALUES (?, ?, ?, 1);
        `;
        await connection.query(sql, [reserva_id, servicio.servicio_id, servicio.importe]);
      }
      if (!conn) connection.release();
    } catch (err) {
      if (!conn) connection.release();
      throw err;
    }
  }

  async modificarServiciosDeReserva(reserva_id, serviciosModificados, conn = null) {
    const connection = conn || (await obtenerPool().getConnection());
    try {
      for (const servicio of serviciosModificados) {
        const sql = `
          UPDATE reservas_servicios 
          SET importe = ?, modificado = CURRENT_TIMESTAMP
          WHERE reserva_id = ? AND servicio_id = ? AND activo = 1;
        `;
        await connection.query(sql, [servicio.importe, reserva_id, servicio.servicio_id]);
      }
      if (!conn) connection.release();
    } catch (err) {
      if (!conn) connection.release();
      throw err;
    }
  }

  async eliminarServiciosDeReserva(reserva_id, serviciosEliminados, conn = null) {
    const connection = conn || (await obtenerPool().getConnection());
    try {
      for (const servicio of serviciosEliminados) {
        const sql = `
          UPDATE reservas_servicios
          SET activo = 0, modificado = CURRENT_TIMESTAMP
          WHERE reserva_id = ? AND servicio_id = ?;
        `;
        await connection.query(sql, [reserva_id, servicio.servicio_id]);
      }
      if (!conn) connection.release();
    } catch (err) {
      if (!conn) connection.release();
      throw err;
    }
  }

  async desactivarPorReserva(reserva_id, conn = null) {
    const connection = conn || (await obtenerPool().getConnection());
    try {
      const sql = `
        UPDATE reservas_servicios 
        SET activo = 0, modificado = CURRENT_TIMESTAMP
        WHERE reserva_id = ?;
      `;
      await connection.query(sql, [reserva_id]);
      if (!conn) connection.release();
    } catch (err) {
      if (!conn) connection.release();
      throw err;
    }
  }
}
