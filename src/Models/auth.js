import { ejecutarConsulta } from '../config/db.js';

export default class AuthModel {
  async buscarUsuarioPorNombre(nombre_usuario) {
    const [rows] = await ejecutarConsulta(
      'SELECT * FROM usuarios WHERE nombre_usuario = ? AND activo = 1',
      [nombre_usuario]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}
