import ComentariosService from "../services/comentarios.service.js";

export default class ComentariosController {
  constructor() {
    this.comentariosService = new ComentariosService();
  }

  async obtenerPorReserva(req, res) {
    try {
      const { reserva_id } = req.params;
      const comentarios = await this.comentariosService.obtenerPorReserva(reserva_id);
      return res.json({ success: true, data: comentarios });
    } catch (error) {
      console.error("❌ Error en obtenerPorReserva:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async crear(req, res) {
    try {
      const payload = { ...req.body };
      if (req.usuario && req.usuario.id) {
        payload.usuario_id = req.usuario.id;
      }

      const comentario = await this.comentariosService.crear(payload);
      return res.status(201).json({ success: true, data: comentario });
    } catch (error) {
      console.error("❌ Error en crear comentario:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const { comentario_id } = req.params;
      await this.comentariosService.eliminar(comentario_id);
      return res.json({ success: true, message: "Comentario eliminado" });
    } catch (error) {
      console.error("❌ Error en eliminar comentario:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
