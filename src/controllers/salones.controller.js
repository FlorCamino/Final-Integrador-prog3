import SalonesService from '../services/salones.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class SalonesController {
  constructor() {
    this.salonesService = new SalonesService();
  }

  obtenerSalones = async (req, res) => {
    try {
      const { limit, offset, estado, sort, order } = req.query;
      const { data } = await this.salonesService.buscarTodos({ limit, offset, estado, sort, order });
      return ResponseBuilder.success(res, data, 'Listado de salones obtenido correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  obtenerSalonPorId = async (req, res) => {
    try {
      const id = parseInt(req.params.id || req.params.salon_id, 10);

      const salon = await this.salonesService.buscarPorId(id);
      if (!salon) throw new ErrorResponse('Salón no encontrado', 404);

      return ResponseBuilder.success(res, salon, 'Salón obtenido correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  crearSalon = async (req, res) => {
    try {
      const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;

      const nuevoSalon = await this.salonesService.agregarSalon({
        titulo,
        direccion,
        latitud,
        longitud,
        capacidad,
        importe,
      });

      return ResponseBuilder.success(res, nuevoSalon, 'Salón creado correctamente', 201);
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  modificarSalon = async (req, res) => {
    try {
      const salon_id = parseInt(req.params.salon_id, 10);
      const { titulo, direccion, latitud, longitud, capacidad, importe, activo } = req.body;

      const resultado = await this.salonesService.actualizarSalon(salon_id, {
        titulo,
        direccion,
        latitud,
        longitud,
        capacidad,
        importe,
        activo,
      });

      if (resultado.affectedRows === 0) throw new ErrorResponse('Salón no encontrado', 404);

      return ResponseBuilder.success(res, null, 'Salón modificado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  eliminarSalon = async (req, res) => {
    try {
      const salon_id = parseInt(req.params.salon_id, 10);

      const resultado = await this.salonesService.borrarSalon(salon_id);
      if (resultado.affectedRows === 0) throw new ErrorResponse('Salón no encontrado', 404);

      return ResponseBuilder.success(res, null, 'Salón eliminado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
