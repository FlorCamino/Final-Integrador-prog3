import fs from 'fs';
import { ROLES } from '../constants/roles.js';
import Reservas from '../models/reservas.js';
import ReservasServicios from '../models/reservas_servicios.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class ReservasService {
  constructor() {
    this.reservaModel = new Reservas();
    this.reservasServiciosModel = new ReservasServicios();
  }

  buscarTodas = async ({ limit = 10, offset = 0, estado, sort, order, usuario }) => {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    if (usuario.tipo_usuario === ROLES.CLIENTE) {
      const data = await this.reservaModel.buscarReservasDetalladasPorUsuario(
        usuario.usuario_id,
        { limit, offset, estado, sort, order }
      );
      return { data };
    }

    if ([ROLES.ADMINISTRADOR, ROLES.EMPLEADO].includes(usuario.tipo_usuario)) {
      const data = await this.reservaModel.buscarReservasDetalladas({
        limit, offset, estado, sort, order
      });
      return { data };
    }

    throw new ErrorResponse('Rol no autorizado para consultar reservas.', 403);
  };

  buscarPorId = async (id, usuario) => {
    const reserva = await this.reservaModel.buscarReservaPorId(id);
    if (!reserva) return { error: 'NOT_FOUND', data: null };

    if (usuario.tipo_usuario === ROLES.CLIENTE && reserva.usuario_id !== usuario.usuario_id) {
      return { error: 'FORBIDDEN', data: null };
    }

    return { error: null, data: reserva };
  };

  obtenerReservaDetalladaPorId = async (id) => {
    const reserva = await this.reservaModel.buscarReservaDetalladaPorId(id);
    if (!reserva) throw new ErrorResponse('Reserva no encontrada.', 404);
    return reserva;
  };

  crearReserva = async (datos) => {
    await this.reservaModel.validarEntidadesActivas(datos);

    const disponible = await this.reservaModel.buscarDisponibilidad({
      salon_id: datos.salon_id,
      turno_id: datos.turno_id,
      fecha_reserva: datos.fecha_reserva,
    });

    if (!disponible)
      throw new ErrorResponse('El salón no está disponible en el turno seleccionado.', 409);

    const reservaCompleta = await this.reservaModel.crearReserva(datos);

    if (!reservaCompleta?.emailCliente) {
      console.warn('Reserva creada pero sin emailCliente asociado.');
    }

    return reservaCompleta;
  };

  actualizarReserva = async (reserva_id, datos) => {
    await this.reservaModel.validarEntidadesActivas(datos);

    const disponible = await this.reservaModel.buscarDisponibilidad({
      salon_id: datos.salon_id,
      turno_id: datos.turno_id,
      fecha_reserva: datos.fecha_reserva,
      excluir_id: reserva_id,
    });

    if (!disponible)
      throw new ErrorResponse('El salón no está disponible en ese turno y fecha.', 409);

    const reservaActual = await this.reservaModel.buscarReservaPorId(reserva_id);
    if (reservaActual?.foto_cumpleaniero && datos.foto_cumpleaniero && reservaActual.foto_cumpleaniero !== datos.foto_cumpleaniero) {
      try {
        if (fs.existsSync(reservaActual.foto_cumpleaniero)) {
          fs.unlinkSync(reservaActual.foto_cumpleaniero);
          console.log(`Imagen anterior eliminada: ${reservaActual.foto_cumpleaniero}`);
        }
      } catch (error) {
        console.warn('No se pudo eliminar la imagen anterior:', error.message);
      }
    }

    return await this.reservaModel.modificarReservaPorId(reserva_id, datos);
  };

  borrarReserva = async (reserva_id) => {
    const reserva = await this.reservaModel.buscarReservaPorId(reserva_id);

    const resultado = await this.reservaModel.desactivarReservaEnCascada(reserva_id);

    if (reserva?.foto_cumpleaniero && fs.existsSync(reserva.foto_cumpleaniero)) {
      try {
        fs.unlinkSync(reserva.foto_cumpleaniero);
        console.log(`Imagen eliminada al borrar la reserva: ${reserva.foto_cumpleaniero}`);
      } catch (error) {
        console.warn('No se pudo eliminar la imagen de la reserva borrada:', error.message);
      }
    }

    return resultado;
  };

  generarReporte = async (desde, hasta) => {
    return await this.reservaModel.obtenerReportePorRango(desde, hasta);
  };
}
