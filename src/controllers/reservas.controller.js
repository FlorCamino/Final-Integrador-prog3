import { enviarCorreoReserva, enviarCorreoAdministrador } from '../utils/notifications.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class ReservasController {
  constructor(reservasService) {
    this.reservasService = reservasService;
  }

  crearReserva = async (req, res) => {
    try {
      const datosReserva = req.body;

      if (!datosReserva.salon_id || !datosReserva.usuario_id || !datosReserva.fecha_reserva) {
        throw new ErrorResponse('Datos de reserva incompletos.', 400);
      }

      const reserva = await this.reservasService.crearReserva(datosReserva);

      if (reserva?.emailCliente) {
        try {
          await enviarCorreoReserva({
            nombreCliente: reserva.nombreCliente ?? 'Cliente',
            emailCliente: reserva.emailCliente,
            salon: reserva.salon ?? 'Sin especificar',
            fecha: reserva.fecha_reserva,
            importe: reserva.importe_total ?? 0,
          });

          await enviarCorreoAdministrador(reserva);

          console.log(`Correos enviados correctamente a ${reserva.emailCliente} y al administrador.`);
        } catch (mailError) {
          console.error('Error al enviar correo de confirmación:', mailError.message);
        }
      } else {
        console.warn('No se envió correo: falta el campo emailCliente.');
      }

      return ResponseBuilder.success(res, reserva, 'Reserva creada correctamente.');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
