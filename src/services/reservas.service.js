import conexionBaseDatos from "../config/db.js";
import { transformarReservaParaBD } from "../utils/reserva.mapper.js";

export class ServicioReservas {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }

  obtenerTodas() {
    return this.repositorio.obtenerTodas();
  }

  obtenerPorId(id) {
    return this.repositorio.obtenerPorId(id);
  }

  async actualizar(idReserva, datos) {
    const conexion = await conexionBaseDatos.getConnection();

    try {
      await conexion.beginTransaction();

      const reservaTransformada = transformarReservaParaBD(datos);

      const requiereVerificacion =
        reservaTransformada.salon_id !== undefined &&
        reservaTransformada.fecha_reserva !== undefined &&
        reservaTransformada.turno_id !== undefined;

      if (requiereVerificacion) {
        const consultaVerificacion = `
          SELECT reserva_id
          FROM reservas
          WHERE salon_id = ?
            AND fecha_reserva = ?
            AND turno_id = ?
            AND reserva_id != ?  -- evitar que se choque consigo misma
          FOR UPDATE
        `;

        const argumentos = [
          reservaTransformada.salon_id,
          reservaTransformada.fecha_reserva,
          reservaTransformada.turno_id,
          idReserva
        ];

        const [reservasOcupadas] = await conexion.query(consultaVerificacion, argumentos);

        if (reservasOcupadas.length) {
          const error = new Error(
            `Ya existe una reserva para el salón ${reservaTransformada.salon_id} en la fecha ${reservaTransformada.fecha_reserva} y turno ${reservaTransformada.turno_id}.`);
          error.code = "E_SLOT_TAKEN";
          throw error;
        }
      }

      const reservaActualizada = await this.repositorio.actualizar(idReserva, datos);
      await conexion.commit();

      return reservaActualizada;
    } catch (error) {
      await conexion.rollback();
      throw error;
    } finally {
      conexion.release();
    }
  }

  eliminar(idReserva) {
    return this.repositorio.eliminar(idReserva);
  }

  async crear(datos) {
    const conexion = await conexionBaseDatos.getConnection();

    try {
      await conexion.beginTransaction();

      const reservaTransformada = transformarReservaParaBD(datos);

      const consultaVerificacion = `
        SELECT reserva_id
        FROM reservas
        WHERE salon_id = ?
          AND fecha_reserva = ?
          AND turno_id = ?
        FOR UPDATE
      `;

      const argumentos = [
        reservaTransformada.salon_id,
        reservaTransformada.fecha_reserva,
        reservaTransformada.turno_id ?? null
      ];

      const [reservasOcupadas] = await conexion.query(consultaVerificacion, argumentos);

      if (reservasOcupadas.length) {
        const error = new Error(
          `Horario no disponible para el salón ${reservaTransformada.salon_id} en la fecha ${reservaTransformada.fecha_reserva} y turno ${reservaTransformada.turno_id}.`);
        error.code = "E_SLOT_TAKEN";
        throw error;
      }

      const reservaCreada = await this.repositorio.crear(reservaTransformada, conexion);
      await conexion.commit();

      return reservaCreada;
    } catch (error) {
      await conexion.rollback();
      throw error;
    } finally {
      conexion.release();
    }
  }
}
