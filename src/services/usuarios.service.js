import Usuarios from '../models/usuarios.js';

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
  }

  buscarPorId = async (id) => {
    return await this.usuarioModel.buscarUsuarioPorId(id);
  }

  buscarPorNombreUsuario = async (nombre_usuario) => {
    return await this.usuarioModel.buscarUsuarioPorNombreUsuario(nombre_usuario);
  }

  actualizarUsuario = async (usuario_id, datos) => {
    return await this.usuarioModel.modificarUsuarioPorId(usuario_id, datos);
  }

  agregarUsuario = async (datos) => {
    return await this.usuarioModel.crearUsuario(datos);
  }

  borrarUsuario = async (usuario_id) => {
    return await this.usuarioModel.eliminarUsuarioPorId(usuario_id);
  }
}
