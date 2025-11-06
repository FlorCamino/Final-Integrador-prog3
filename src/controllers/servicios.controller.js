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
      const id = parseInt(req.params.id || req.params.servicio_id, 10);

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

      const nuevoServicio = await this.serviciosService.agregarServicio({ descripcion, importe });

      return ResponseBuilder.success(res, nuevoServicio, 'Servicio creado correctamente', 201);
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  modificarServicio = async (req, res) => {
    try {
      const servicio_id = parseInt(req.params.servicio_id, 10);
      const { descripcion, importe, activo } = req.body;

      const resultado = await this.serviciosService.actualizarServicio(servicio_id, {
        descripcion,
        importe,
        activo,
      });

      if (resultado.affectedRows === 0) throw new ErrorResponse('Servicio no encontrado', 404);

      return ResponseBuilder.success(res, null, 'Servicio modificado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  eliminarServicio = async (req, res) => {
    try {
      const servicio_id = parseInt(req.params.servicio_id, 10);

      const resultado = await this.serviciosService.borrarServicios(servicio_id);
      if (resultado.affectedRows === 0) throw new ErrorResponse('Servicio no encontrado', 404);

      return ResponseBuilder.success(res, null, 'Servicio eliminado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
