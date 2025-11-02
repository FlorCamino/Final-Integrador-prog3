import Usuarios from '../models/usuarios.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class UsuariosService {
  constructor() {
    this.usuarioModel = new Usuarios();
  }

  buscarTodos = async ({ limit = 10, offset = 0, estado, sort, order }) => {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const rows = await this.usuarioModel.buscarTodosUsuarios({ limit, offset, estado, sort, order });
    return { data: rows };
  };

  buscarPorId = async (id) => {
    return await this.usuarioModel.buscarUsuarioPorId(id);
  };

  buscarPorNombreUsuario = async (nombre_usuario) => {
    return await this.usuarioModel.buscarUsuarioPorNombreUsuario(nombre_usuario);
  };

  agregarUsuario = async (datos) => {
    try {
      const nuevoUsuario = await this.usuarioModel.crearUsuario(datos);
      return nuevoUsuario;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ErrorResponse('El nombre de usuario ya está registrado.', 400);
      }

      throw new ErrorResponse('Error al crear el usuario.', 500, error.message);
    }
  };

  actualizarUsuario = async (usuario_id, datos) => {
    try {
      const resultado = await this.usuarioModel.modificarUsuarioPorId(usuario_id, datos);
      return resultado;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ErrorResponse('El nombre de usuario ya está registrado por otro usuario.', 400);
      }

      throw new ErrorResponse('Error al actualizar el usuario.', 500, error.message);
    }
  };

  borrarUsuario = async (usuario_id) => {
    try {
      const resultado = await this.usuarioModel.eliminarUsuarioPorId(usuario_id);
      return resultado;
    } catch (error) {
      throw new ErrorResponse('Error al eliminar el usuario.', 500, error.message);
    }
  };
}
