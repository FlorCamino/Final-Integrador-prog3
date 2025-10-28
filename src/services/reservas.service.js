import { ROLES } from '../enums/roles.js';
import Reservas from '../Models/reservas.js';
import ReservasServicios from '../Models/reservas_servicios.js';

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
      const { rows } = await this.reservaModel.buscarReservasPorUsuario(usuario.usuario_id, { limit, offset, estado, sort, order });
      return { data: rows };
    } else {
        const { rows } = await this.reservaModel.buscarTodasReservas({ limit, offset, estado, sort, order });
        return { data: rows };
    }
  };

  buscarPorId = async (id, usuario) => {
    if (usuario.tipo_usuario === ROLES.CLIENTE) {
      const reserva = await this.reservaModel.buscarReservasPorUsuario(usuario.usuario_id, { id });
      return reserva.length ? reserva[0] : null;
    } else {
      const reserva = await this.reservaModel.buscarReservaPorId(id);
      return reserva;
    }
  };

  actualizarReserva = async (reserva_id, datos) => {
    const resultado = await this.reservaModel.modificarReservaPorId(reserva_id, {
      fecha_reserva: datos.fecha_reserva,
      salon_id: datos.salon_id,
      usuario_id: datos.usuario_id,
      turno_id: datos.turno_id,
      foto_cumpleaniero: datos.foto_cumpleaniero,
      tematica: datos.tematica,
      importe_salon: datos.importe_salon,
      importe_total: datos.importe_total,
    });

    if (Array.isArray(datos.servicios)) {
      const { nuevosServicios = [], serviciosModificados = [], serviciosEliminados = [] } = datos.servicios;

      if (nuevosServicios.length) {
        await this.reservasServiciosModel.agregarServiciosDeReserva(reserva_id, nuevosServicios);
      }

      if (serviciosModificados.length) {
        await this.reservasServiciosModel.modificarServiciosDeReserva(reserva_id, serviciosModificados);
      }

      if (serviciosEliminados.length) {
        await this.reservasServiciosModel.eliminarServiciosDeReserva(reserva_id, serviciosEliminados);
      }
    }
    return resultado;
  };

  crearReserva = async (datos) => {
    const reservaDatos = {
      fecha_reserva: datos.fecha_reserva,
      salon_id: datos.salon_id,
      usuario_id: datos.usuario_id,
      turno_id: datos.turno_id,
      foto_cumpleaniero: datos.foto_cumpleaniero,
      tematica: datos.tematica,
      importe_salon: datos.importe_salon,
      importe_total: datos.importe_total,
    };

    const nuevaReserva = await this.reservaModel.crearReserva(reservaDatos);

    if (Array.isArray(datos.servicios) && datos.servicios.length > 0) {
      await this.reservasServiciosModel.crearReservaConServicios(
        nuevaReserva.reserva_id,
        datos.servicios
      );
    };

    return nuevaReserva;
  };

  borrarReserva = async (reserva_id) => {
    const resultado = await this.reservaModel.eliminarReservaPorId(reserva_id);
    return resultado;
  };

  generarReporte = async (desde, hasta) => {
    return await this.reservaModel.obtenerReportePorRango(desde, hasta);
  };
}
