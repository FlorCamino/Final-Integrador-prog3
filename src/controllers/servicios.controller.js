import ServiciosService from '../services/servicios.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class ServiciosController {
  constructor() {
    this.serviciosService = new ServiciosService();
  }

  obtenerServicios = async (req, res) => {
    try {
      const { limit, offset, estado, sort, order } = req.query;
      const { data } = await this.serviciosService.buscarTodos({
        limit,
        offset,
        estado,
        sort,
        order,
      });

      return ResponseBuilder.success(res, data, 'Listado de servicios obtenido correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  obtenerServicioPorId = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw new ErrorResponse('ID no válido', 400);

      const servicio = await this.serviciosService.buscarPorId(id);
      if (!servicio) throw new ErrorResponse('Servicio no encontrado', 404);

      return ResponseBuilder.success(res, servicio, 'Servicio obtenido correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  crearServicio = async (req, res) => {
    try {
      const { descripcion, importe } = req.body;

      if (!descripcion || isNaN(importe)) {
        throw new ErrorResponse('La descripción y el importe son obligatorios', 400);
      }

      const nuevoServicio = await this.serviciosService.agregarServicio({
        descripcion,
        importe,
      });

      return ResponseBuilder.success(res, nuevoServicio, 'Servicio creado correctamente', 201);
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  modificarServicio = async (req, res) => {
    try {
      const { servicio_id } = req.params;
      const { descripcion, importe } = req.body;

      if (!descripcion || isNaN(importe)) {
        throw new ErrorResponse('Descripción e importe son requeridos', 400);
      }

      const resultado = await this.serviciosService.actualizarServicio(servicio_id, {
        descripcion,
        importe,
      });

      if (resultado.affectedRows === 0) {
        throw new ErrorResponse('Servicio no encontrado', 404);
      }

      return ResponseBuilder.success(res, null, 'Servicio modificado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  eliminarServicio = async (req, res) => {
    try {
      const { servicio_id } = req.params;
      if (isNaN(servicio_id)) throw new ErrorResponse('ID no válido', 400);

      const resultado = await this.serviciosService.borrarServicios(servicio_id);
      if (resultado.affectedRows === 0) {
        throw new ErrorResponse('Servicio no encontrado', 404);
      }

      return ResponseBuilder.success(res, null, 'Servicio eliminado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
