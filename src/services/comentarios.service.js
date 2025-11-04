import Comentarios from '../models/comentarios.js';

export default class ComentariosService {
  constructor() {
    this.model = new Comentarios();
  }

  obtenerPorReserva = async (reserva_id) => {
    return await this.model.obtenerPorReserva(reserva_id);
  }

  crear = async (data) => {
    return await this.model.crear(data);
  }

  eliminar = async (comentario_id) =>{
    return await this.model.eliminar(comentario_id);
  }
}
