export class ControladorReservas {
  constructor(servicio) {
    this.servicio = servicio;
  }

  obtenerTodas = async (_req, res) => {
    try {
      const reservas = await this.servicio.obtenerTodas();
      res.json(reservas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  obtenerPorId = async (req, res) => {
    try {
      const reserva = await this.servicio.obtenerPorId(req.params.id);
      if (!reserva) {
        return res.status(404).json({ mensaje: "Reserva no encontrada" });
      }
      res.json(reserva);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  crear = async (req, res) => {
    try {
      const nuevaReserva = await this.servicio.crear(req.body);
      res.status(201).json(nuevaReserva);
    } catch (error) {
      const codigo = error.code === "E_SLOT_TAKEN" ? 409 : 400;
      res.status(codigo).json({ error: error.message });
    }
  };

  actualizar = async (req, res) => {
    try {
      const reservaActualizada = await this.servicio.actualizar(req.params.id, req.body);
      if (!reservaActualizada) {
        return res.status(404).json({ mensaje: "Reserva no encontrada" });
      }
      res.json(reservaActualizada);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  eliminar = async (req, res) => {
    try {
      const eliminada = await this.servicio.eliminar(req.params.id);
      if (!eliminada) {
        return res.status(404).json({ mensaje: "Reserva no encontrada" });
      }
      res.json({ mensaje: "Reserva eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
