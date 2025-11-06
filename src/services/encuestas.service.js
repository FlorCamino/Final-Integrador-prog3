import EncuestasModel from '../models/encuestas.js';
import { ejecutarConsulta } from '../config/db.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class EncuestasService {
  constructor() {
    this.model = new EncuestasModel();
  }

  async crearEncuesta(data) {
    const { reserva_id, puntuacion, comentario } = data;

    if (!reserva_id || !puntuacion) {
      throw new ErrorResponse('La reserva y la puntuación son obligatorias', 400);
    }

    if (puntuacion < 1 || puntuacion > 5) {
      throw new ErrorResponse('La puntuación debe estar entre 1 y 5', 400);
    }

    const [reserva] = await ejecutarConsulta(
      `SELECT fecha_reserva FROM reservas WHERE reserva_id = ? AND activo = 1`,
      [reserva_id]
    );

    if (!reserva) {
      throw new ErrorResponse('La reserva indicada no existe', 404);
    }

    if (new Date(reserva.fecha_reserva) > new Date()) {
      throw new ErrorResponse('La encuesta solo puede completarse después del evento', 400);
    }

    const id = await this.model.crearEncuesta({ reserva_id, puntuacion, comentario });
    return { id, message: 'Encuesta registrada con éxito' };
  }


  async listarEncuestas() {
    return await this.model.obtenerEncuestas();
  }


  async obtenerPorReserva(reserva_id) {
    const encuesta = await this.model.obtenerPorReserva(reserva_id);
    if (!encuesta) {
      throw new ErrorResponse('No se encontró encuesta para esta reserva', 404);
    }
    return encuesta;
  }
}
