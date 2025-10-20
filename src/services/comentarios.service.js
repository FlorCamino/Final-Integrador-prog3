import Comentarios from '../models/comentarios.js';

export default class ComentariosService {
  constructor() {
    this.model = new Comentarios();
  }

  async obtenerPorReserva(reserva_id) {
    return await this.model.obtenerPorReserva(reserva_id);
  }

  async crear(data) {
    return await this.model.crear(data);
  }

  async eliminar(comentario_id) {
    return await this.model.eliminar(comentario_id);
  }
}
