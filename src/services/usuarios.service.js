import Usuarios from '../models/usuarios.js';

export default class UsuariosService {
  constructor() {
    this.usuarioModel = new Usuarios();
  }

  async buscarTodos({ limit = 10, offset = 0, estado, sort, order }) {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const rows = await this.usuarioModel.buscarTodosUsuarios({ limit, offset, estado, sort, order });
    return { data: rows };
  }

  async buscarPorId(id) {
    return await this.usuarioModel.buscarUsuarioPorId(id);
  }

  async buscarPorNombreUsuario(nombre_usuario) {
    return await this.usuarioModel.buscarUsuarioPorNombreUsuario(nombre_usuario);
  }

  async actualizarUsuario(usuario_id, datos) {
    return await this.usuarioModel.modificarUsuarioPorId(usuario_id, datos);
  }

  async agregarUsuario(datos) {
    return await this.usuarioModel.crearUsuario(datos);
  }

  async borrarUsuario(usuario_id) {
    return await this.usuarioModel.eliminarUsuarioPorId(usuario_id);
  }
}
