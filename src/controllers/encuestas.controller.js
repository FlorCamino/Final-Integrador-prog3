import EncuestasService from '../services/encuestas.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class EncuestasController {
  constructor() {
    this.service = new EncuestasService();
  }

  crearEncuesta = async (req, res) => {
    try {
      const result = await this.service.crearEncuesta(req.body);
      return ResponseBuilder.success(res, result, 'Encuesta creada correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  listarEncuestas = async (_req, res) => {
    try {
      const data = await this.service.listarEncuestas();
      return ResponseBuilder.success(res, data, 'Listado de encuestas obtenido');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  obtenerPorReserva = async (req, res) => {
    try {
      const { reserva_id } = req.params;
      const data = await this.service.obtenerPorReserva(reserva_id);
      return ResponseBuilder.success(res, data, 'Encuesta encontrada');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
