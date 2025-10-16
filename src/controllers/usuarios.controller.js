import Usuarios from '../Models/usuarios.js';

export default class UsuariosService {
  constructor() {
    this.usuariosModel = new Usuarios();
  }
    buscarTodos = async ({ limit = 10, offset = 0, estado, sort, order }) => {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;
    const { rows } = await this.usuariosModel.buscarTodosUsuarios({ limit, offset, estado, sort, order });
    return { data: rows };
  }
    buscarPorId = async (id) => {
    const usuario = await this.usuariosModel.buscarUsuarioPorId(id);
    return usuario;
  }
    actualizarUsuario = async (usuario_id, datos) => {
    const resultado = await this.usuariosModel.modificarUsuarioPorId(usuario_id, datos);
    return resultado;
  }
    agregarUsuario = async (datos) => {
    const nuevoUsuario = await this.usuariosModel.crearUsuario(datos);
    return nuevoUsuario;
  }
    borrarUsuario = async (usuario_id) => {
    const resultado = await this.usuariosModel.eliminarUsuarioPorId(usuario_id);
    return resultado;
  }
}
