import ReservasService from '../services/reservas.service.js';
import { ROLES } from '../constants/roles.js';
import { NotificationService } from '../services/notifications.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class ReservasController {
  constructor() {
    this.reservasService = new ReservasService();
  }

  obtenerReservas = async (req, res) => {
    try {
      const { limit, offset, estado, sort, order } = req.query;
      const { data } = await this.reservasService.buscarTodas({
        limit,
        offset,
        estado,
        sort,
        order,
        usuario: req.user,
      });

      return ResponseBuilder.success(res, data, 'Listado de reservas obtenido correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  obtenerReservaPorId = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw new ErrorResponse('ID no válido', 400);

      const usuario = req.user;
      const { error, data: reserva } = await this.reservasService.buscarPorId(id, usuario);

      if (error === 'FORBIDDEN')
        throw new ErrorResponse('No tiene permiso para acceder a esta reserva', 403);
      if (error === 'NOT_FOUND')
        throw new ErrorResponse('Reserva no encontrada', 404);

      return ResponseBuilder.success(res, reserva, 'Reserva obtenida correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  crearReserva = async (req, res) => {
    try {
      let usuario_id = req.body.usuario_id;

      if (req.user.tipo_usuario === ROLES.CLIENTE) {
        usuario_id = req.user.usuario_id;
      } else if (!usuario_id) {
        throw new ErrorResponse('Debe indicar el usuario para la reserva', 400);
      }

      const {
        fecha_reserva,
        salon_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      } = req.body;

      if (!salon_id || !usuario_id || !fecha_reserva || !turno_id) {
        throw new ErrorResponse('Datos de reserva incompletos.', 400);
      }

      if (!Array.isArray(servicios) || servicios.length === 0) {
        throw new ErrorResponse('Debe seleccionar al menos un servicio para la reserva.', 400);
      }

      const reserva = await this.reservasService.crearReserva({
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      });

      if (reserva?.emailCliente) {
        try {
          await NotificationService.enviarCorreoReserva({
            nombreCliente: reserva.nombreCliente,
            emailCliente: reserva.emailCliente,
            salon: reserva.salon,
            fecha: reserva.fecha_reserva,
            turno: reserva.turno_descripcion || reserva.turno,
            tematica: reserva.tematica,
            servicios: reserva.servicios || [],
            importeSalon: reserva.importe_salon,
            importeTotal: reserva.importe_total,
          });

          await NotificationService.enviarCorreoAdministrador(reserva);

          console.log(
            `Correos enviados correctamente a ${reserva.emailCliente} y a los administradores.`
          );
        } catch (mailError) {
          console.error('Error al enviar correo de confirmación:', mailError.message);
        }
      } else {
        console.warn('No se envió correo: falta el campo emailCliente en la reserva.');
      }

      return ResponseBuilder.success(res, reserva, 'Reserva creada correctamente.');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  modificarReserva = async (req, res) => {
    try {
      if (req.user.tipo_usuario !== ROLES.ADMINISTRADOR) {
        throw new ErrorResponse('Solo el administrador puede modificar reservas.', 403);
      }

      const { reserva_id } = req.params;
      const {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      } = req.body;

      if (!fecha_reserva || !salon_id || !usuario_id || !turno_id) {
        throw new ErrorResponse('Faltan campos obligatorios.', 400);
      }

      await this.reservasService.actualizarReserva(reserva_id, {
        fecha_reserva,
        salon_id,
        usuario_id,
        turno_id,
        foto_cumpleaniero,
        tematica,
        importe_salon,
        importe_total,
        servicios,
      });

      return ResponseBuilder.success(res, null, 'Reserva modificada correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  eliminarReserva = async (req, res) => {
    try {
      if (req.user.tipo_usuario !== ROLES.ADMINISTRADOR) {
        throw new ErrorResponse('Solo el administrador puede eliminar reservas.', 403);
      }

      const { reserva_id } = req.params;
      if (isNaN(reserva_id)) throw new ErrorResponse('ID no válido', 400);

      const resultado = await this.reservasService.borrarReserva(reserva_id);

      if (resultado.affectedRows === 0) {
        throw new ErrorResponse('Reserva no encontrada', 404);
      }

      return ResponseBuilder.success(res, null, 'Reserva eliminada correctamente.');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
