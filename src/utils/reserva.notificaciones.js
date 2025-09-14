import transporter from "../config/email.js";
import { entorno } from "../config/env.js";

export async function enviarNotificacionReserva(emailUsuario, reserva) {
  const mailOptions = {
    from: entorno.SMTP_DESDE,   
    to: emailUsuario,
    bcc: entorno.ADMIN_EMAIL,
    subject: "Tu reserva fue confirmada",
    template: "reserva.confirmada",
    context: {
      reserva_id: reserva.reserva_id,
      fecha: new Date(reserva.fecha_reserva).toLocaleDateString("es-ES"),
      salon: reserva.salon,
      direccion: reserva.direccion,
      capacidad: reserva.capacidad,
      ciudad: reserva.ciudad ?? "Ciudad",
      mapaUrl: reserva.mapaUrl,
    },
  };

  const info = await transporter.sendMail(mailOptions);
}
