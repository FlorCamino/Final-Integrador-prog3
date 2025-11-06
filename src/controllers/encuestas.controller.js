import EncuestasService from '../services/encuestas.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { validationResult } from 'express-validator';

export default class EncuestasController {
  constructor() {
    this.service = new EncuestasService();
  }

  crearEncuesta = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const mensaje = errors.array()[0].msg;
        return ResponseBuilder.error(res, mensaje, 400);
      }

      const result = await this.service.crearEncuesta(req.body, req.user);

      return ResponseBuilder.success(res, result, 'Encuesta creada correctamente', 201);
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  listarEncuestas = async (req, res) => {
    try {
      const data = await this.service.listarEncuestas(req.user);
      return ResponseBuilder.success(res, data, 'Listado de encuestas obtenido', 200);
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  obtenerPorReserva = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const mensaje = errors.array()[0].msg;
        return ResponseBuilder.error(res, mensaje, 400);
      }

      const { reserva_id } = req.params;
      const data = await this.service.obtenerPorReserva(reserva_id, req.user);

      return ResponseBuilder.success(res, data, 'Encuesta encontrada', 200);
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  eliminarEncuesta = async (req, res) => {
    try {
      const { encuesta_id } = req.params;
      const result = await this.service.eliminarEncuesta(encuesta_id, req.user);

      return ResponseBuilder.success(res, result, 'Encuesta eliminada correctamente', 200);
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
