import { ROLES } from '../constants/roles.js';
import Reservas from '../Models/reservas.js';
import ReservasServicios from '../Models/reservas_servicios.js';
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
      const data = await this.reservaModel.buscarReservasDetalladasPorUsuario(usuario.usuario_id, { limit, offset });
      return { data };
    } else if ([ROLES.ADMINISTRADOR, ROLES.EMPLEADO].includes(usuario.tipo_usuario)) {
      const data = await this.reservaModel.buscarReservasDetalladas({ limit, offset });
      return { data };
    } else {
      throw new Error('Rol no autorizado para consultar reservas');
    }
  };

  buscarPorId = async (id, usuario) => {
    const reserva = await this.reservaModel.buscarReservaPorId(id);

    if (!reserva) {
      return { error: 'NOT_FOUND', data: null };
    }

    if (usuario.tipo_usuario === ROLES.CLIENTE && reserva.usuario_id !== usuario.usuario_id) {
      return { error: 'FORBIDDEN', data: null };
    }
    return { error: null, data: reserva };
  };

  obtenerReservaDetalladaPorId = async (id) => {
    const reservasDetalladas = await this.reservaModel.buscarReservasDetalladas({ limit: 999, offset: 0 });
    const reserva = reservasDetalladas.find(r => r.reserva_id === parseInt(id));

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

    const nuevaReserva = await this.reservaModel.crearReservaCompleta(datos);
    return nuevaReserva;
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

    return await this.reservaModel.actualizarReservaCompleta(reserva_id, datos);
  };

  borrarReserva = async (reserva_id) => {
    return await this.reservaModel.desactivarReservaEnCascada(reserva_id);
  };

  generarReporte = async (desde, hasta) => {
    return await this.reservaModel.obtenerReportePorRango(desde, hasta);
  };
}
