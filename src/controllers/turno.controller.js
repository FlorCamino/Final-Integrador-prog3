import TurnosService from '../services/turnos.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class TurnosController {
  constructor() {
    this.turnosService = new TurnosService();
  }


  obtenerTurnos = async (req, res) => {
    try {
      const { limit, offset, estado, sort, order } = req.query;
      const { data } = await this.turnosService.buscarTodos({ limit, offset, estado, sort, order });
      return ResponseBuilder.success(res, data, 'Listado de turnos obtenido correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  obtenerTurnoPorId = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw new ErrorResponse('ID no válido', 400);

      const turno = await this.turnosService.buscarPorId(id);
      if (!turno) throw new ErrorResponse('Turno no encontrado', 404);

      return ResponseBuilder.success(res, turno, 'Turno obtenido correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  crearTurno = async (req, res) => {
    try {
      const { orden, hora_desde, hora_hasta } = req.body;

      if (!orden || !hora_desde || !hora_hasta) {
        throw new ErrorResponse('Los campos orden, hora_desde y hora_hasta son obligatorios', 400);
      }

      const nuevoTurno = await this.turnosService.agregarTurno({
        orden,
        hora_desde,
        hora_hasta,
      });

      return ResponseBuilder.success(res, nuevoTurno, 'Turno creado correctamente', 201);
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  modificarTurno = async (req, res) => {
    try {
      const turnoId = req.params.id || req.params.turno_id;
      const { orden, hora_desde, hora_hasta } = req.body;

      if (!turnoId || isNaN(parseInt(turnoId, 10))) {
        throw new ErrorResponse('ID no válido', 400);
      }

      if (
        orden === undefined &&
        hora_desde === undefined &&
        hora_hasta === undefined
      ) {
        throw new ErrorResponse('Debe enviar al menos un campo para actualizar', 400);
      }

      const resultado = await this.turnosService.actualizarTurno(parseInt(turnoId, 10), {
        orden,
        hora_desde,
        hora_hasta,
      });

      if (resultado.affectedRows === 0) {
        throw new ErrorResponse('Turno no encontrado', 404);
      }

      return ResponseBuilder.success(res, null, 'Turno modificado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  eliminarTurno = async (req, res) => {
    try {
      const id = req.params.id || req.params.turno_id;
      if (!id || isNaN(parseInt(id, 10))) throw new ErrorResponse('ID no válido', 400);

      const resultado = await this.turnosService.borrarTurno(parseInt(id, 10));
      if (resultado.affectedRows === 0) {
        throw new ErrorResponse('Turno no encontrado', 404);
      }

      return ResponseBuilder.success(res, null, 'Turno eliminado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
