import UsuariosService from '../services/usuarios.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class UsuariosController {
  constructor() {
    this.usuariosService = new UsuariosService();
  }

  obtenerUsuarios = async (req, res) => {
    try {
      const { limit, offset, estado, sort, order } = req.query;
      const { data } = await this.usuariosService.buscarTodos({ limit, offset, estado, sort, order });
      return ResponseBuilder.success(res, data, 'Listado de usuarios obtenido correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  obtenerUsuarioPorId = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw new ErrorResponse('ID no válido', 400);

      const usuario = await this.usuariosService.buscarPorId(id);
      if (!usuario) throw new ErrorResponse('Usuario no encontrado', 404);

      return ResponseBuilder.success(res, usuario, 'Usuario obtenido correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  crearUsuario = async (req, res) => {
    try {
      const { nombre, apellido, nombre_usuario, password, tipo_usuario } = req.body;

      if (!nombre || !apellido || !nombre_usuario || !password || !tipo_usuario) {
        throw new ErrorResponse('Todos los campos son obligatorios', 400);
      }

      const nuevoUsuario = await this.usuariosService.agregarUsuario({
        nombre,
        apellido,
        nombre_usuario,
        password,
        tipo_usuario,
      });

      return ResponseBuilder.success(res, nuevoUsuario, 'Usuario creado correctamente', 201);
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  modificarUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, apellido, nombre_usuario, password, tipo_usuario, activo } = req.body;

      if (!nombre || !apellido || !nombre_usuario || !tipo_usuario) {
        throw new ErrorResponse('Faltan campos obligatorios', 400);
      }

      const resultado = await this.usuariosService.actualizarUsuario(id, {
        nombre,
        apellido,
        nombre_usuario,
        password,
        tipo_usuario,
        activo,
      });

      if (resultado.affectedRows === 0) {
        throw new ErrorResponse('Usuario no encontrado', 404);
      }

      return ResponseBuilder.success(res, null, 'Usuario modificado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  eliminarUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      if (isNaN(id)) throw new ErrorResponse('ID no válido', 400);

      const resultado = await this.usuariosService.borrarUsuario(id);
      if (resultado.affectedRows === 0) {
        throw new ErrorResponse('Usuario no encontrado', 404);
      }

      return ResponseBuilder.success(res, null, 'Usuario eliminado correctamente');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
