import { enviarNotificacionReserva } from "../utils/reserva.notificaciones.js";

export class ControladorReservas {
  constructor(servicio) {
    this.servicio = servicio;
  }

  obtenerTodas = async (_req, res) => {
    try {
      const reservas = await this.servicio.obtenerTodas();
      res.json({ estado: "ok", data: reservas });
    } catch (error) {
      res.status(500).json({ estado: "error", mensaje: error.message });
    }
  };

  obtenerPorId = async (req, res) => {
    try {
      const reserva = await this.servicio.obtenerPorId(req.params.id);
      if (!reserva) {
        return res
          .status(404)
          .json({ estado: "error", mensaje: "Reserva no encontrada" });
      }
      res.json({ estado: "ok", data: reserva });
    } catch (error) {
      res.status(500).json({ estado: "error", mensaje: error.message });
    }
  };

  crear = async (req, res) => {
    try {
      const nuevaReserva = await this.servicio.crear(req.body);

      console.log("DEBUG: Nueva reserva creada:", nuevaReserva);

      const correoDestino = nuevaReserva.email || nuevaReserva.nombre_usuario;

      if (correoDestino) {
        try {
          console.log("DEBUG: Enviando correo a:", correoDestino);
          await enviarNotificacionReserva(correoDestino, nuevaReserva);
        } catch (errorCorreo) {
          console.error("Error al enviar correo:", errorCorreo.message);
        }
      } else {
        console.warn("DEBUG: La reserva no tiene ningún email válido.");
      }

      // if (nuevaReserva?.email) {
      //   try {
      //     await enviarNotificacionReserva(nuevaReserva.email, nuevaReserva);
      //   } catch (errorCorreo) {
      //     console.error("Error al enviar correo:", errorCorreo.message);
      //   }
      // }

      res.status(201).json({
        estado: "ok",
        mensaje: "Reserva creada correctamente",
        data: nuevaReserva,
        id: nuevaReserva.reserva_id,
      });
    } catch (error) {
      const codigo = error.code === "E_SLOT_TAKEN" ? 409 : 500;
      res.status(codigo).json({ estado: "error", mensaje: error.message });
    }
  };

  actualizar = async (req, res) => {
    try {
      const reservaActualizada = await this.servicio.actualizar(
        req.params.id,
        req.body
      );

      if (!reservaActualizada) {
        return res
          .status(404)
          .json({ estado: "error", mensaje: "Reserva no encontrada" });
      }

      res.json({
        estado: "ok",
        mensaje: "Reserva actualizada correctamente",
        data: reservaActualizada,
      });
    } catch (error) {
      res.status(500).json({ estado: "error", mensaje: error.message });
    }
  };

  eliminar = async (req, res) => {
    try {
      const eliminada = await this.servicio.eliminar(req.params.id);

      if (!eliminada) {
        return res
          .status(404)
          .json({
            estado: "error",
            mensaje: "Reserva no encontrada o ya eliminada",
          });
      }

      res.json({
        estado: "ok",
        mensaje: "Reserva eliminada correctamente",
      });
    } catch (error) {
      res.status(500).json({ estado: "error", mensaje: error.message });
    }
  };
}
