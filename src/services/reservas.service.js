import conexionBaseDatos from "../config/db.js";
import { transformarReservaParaBD } from "../utils/reserva.mapper.js";
import consultasSQL from "../sql/reservas.sql.js";

export class ServicioReservas {
  constructor(repositorio) {
    this.repositorio = repositorio;
  }

  obtenerTodas(cantidad, ordenarPor, ordenarDireccion) {
    return this.repositorio.obtenerTodas(cantidad, ordenarPor, ordenarDireccion);
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
        const [reservasOcupadas] = await conexion.query(
          consultasSQL.verificarDuplicadoExcluyendoId,
          [
            reservaTransformada.salon_id,
            reservaTransformada.fecha_reserva,
            reservaTransformada.turno_id,
            idReserva
          ]
        );

        if (reservasOcupadas.length) {
          const error = new Error(
            `Ya existe una reserva para el salón ${reservaTransformada.salon_id} en la fecha ${reservaTransformada.fecha_reserva} y turno ${reservaTransformada.turno_id}.`
          );
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

      const [reservasOcupadas] = await conexion.query(
        consultasSQL.verificarDuplicado,
        [
          reservaTransformada.salon_id,
          reservaTransformada.fecha_reserva,
          reservaTransformada.turno_id ?? null
        ]
      );

      if (reservasOcupadas.length) {
        const error = new Error(
          `Horario no disponible para el salón ${reservaTransformada.salon_id} en la fecha ${reservaTransformada.fecha_reserva} y turno ${reservaTransformada.turno_id}.`
        );
        error.code = "E_SLOT_TAKEN";
        throw error;
      }

      const reservaCompleta = await this.repositorio.crear(reservaTransformada, conexion);
      reservaCompleta.mapaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservaCompleta.direccion + ', Concordia, Entre Ríos')}`;

      await conexion.commit();
      return reservaCompleta;
    } catch (error) {
      await conexion.rollback();
      throw error;
    } finally {
      conexion.release();
    }
  }
}
