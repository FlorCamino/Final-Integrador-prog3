import ComentariosService from '../services/comentarios.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class ComentariosController {
  constructor() {
    this.comentariosService = new ComentariosService();
  }

  obtenerPorReserva = async (req, res) => {
    try {
      const { reserva_id } = req.params;
      const comentarios = await this.comentariosService.obtenerPorReserva(reserva_id);

      if (!comentarios || comentarios.length === 0) {
        return ResponseBuilder.success(res, [], 'No hay comentarios para esta reserva');
      }

      return ResponseBuilder.success(res, comentarios, 'Comentarios obtenidos correctamente');
    } catch (error) {
      console.error('Error en obtenerPorReserva:', error);
      return ResponseBuilder.handleError(res, error);
    }
  };

  crearComentario = async (req, res) => {
    try {
      const { reserva_id, usuario_id, comentario, calificacion } = req.body;
      const nuevoComentario = await this.comentariosService.crear({
        reserva_id,
        usuario_id,
        comentario,
        calificacion: calificacion ?? null,
      });

      return ResponseBuilder.success(res, nuevoComentario, 'Comentario creado correctamente', 201);
    } catch (error) {
      console.error('Error en crear comentario:', error);
      return ResponseBuilder.handleError(res, error);
    }
  };

  eliminarComentario = async (req, res) => {
    try {
      const { comentario_id } = req.params;
      const resultado = await this.comentariosService.eliminar(comentario_id);
      if (resultado.affectedRows === 0) {
        throw new ErrorResponse('Comentario no encontrado', 404);
      }

      return ResponseBuilder.success(res, null, 'Comentario eliminado correctamente');
    } catch (error) {
      console.error('Error en eliminar comentario:', error);
      return ResponseBuilder.handleError(res, error);
    }
  };
}
