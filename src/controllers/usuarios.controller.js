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
      const { nombre, apellido, nombre_usuario, contrasenia, password, tipo_usuario } = req.body;

      const finalPassword = contrasenia ?? password;

      if (!nombre || !apellido || !nombre_usuario || !finalPassword || !tipo_usuario) {
        throw new ErrorResponse('Todos los campos son obligatorios', 400);
      }

      const nuevoUsuario = await this.usuariosService.agregarUsuario({
        nombre,
        apellido,
        nombre_usuario,
        password: finalPassword,
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
      const {
        nombre,
        apellido,
        nombre_usuario,
        contrasenia,
        tipo_usuario,
        activo,
      } = req.body;

      if (!id || isNaN(parseInt(id, 10))) {
        throw new ErrorResponse('ID no válido', 400);
      }

      if (
        nombre === undefined &&
        apellido === undefined &&
        nombre_usuario === undefined &&
        contrasenia === undefined &&
        tipo_usuario === undefined &&
        activo === undefined
      ) {
        throw new ErrorResponse('Debe enviar al menos un campo para actualizar', 400);
      }

      const datosActualizar = {
        ...(nombre !== undefined && { nombre }),
        ...(apellido !== undefined && { apellido }),
        ...(nombre_usuario !== undefined && { nombre_usuario }),
        ...(contrasenia !== undefined && { password: contrasenia }),
        ...(tipo_usuario !== undefined && { tipo_usuario }),
        ...(activo !== undefined && { activo }),
      };

      const resultado = await this.usuariosService.actualizarUsuario(id, datosActualizar);

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
