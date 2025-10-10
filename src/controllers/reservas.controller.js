import { enviarCorreoReserva, enviarCorreoAdministrador } from '../utils/notifications.js';

export default class ReservasController {
  crearReserva = async (req, res) => {
    
      if (reserva.emailCliente) {
        try {
          await enviarCorreoReserva({
            nombreCliente: reserva.nombreCliente ?? 'Cliente',
            emailCliente: reserva.emailCliente,
            salon: reserva.salon ?? 'Sin especificar',
            fecha: reserva.fecha_reserva,
            importe: reserva.importe_total ?? 0,
          });

          await enviarCorreoAdministrador(reserva);
        } catch (mailError) {
          console.error('Error al enviar correo de confirmación:', mailError.message);
        }
      } else {
        console.warn('No se envió correo porque no se proporcionó emailCliente.');
      }
  };
}
