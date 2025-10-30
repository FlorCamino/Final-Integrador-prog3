import AuthModel from '../models/auth.js';
import bcrypt from 'bcryptjs';
import { JWTHelper } from '../utils/jwt.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { obtenerNombreRol } from '../constants/roles.js';

export default class AuthService {
  constructor() {
    this.authModel = new AuthModel();
  }

  login = async (nombre_usuario, contrasenia) => {
    const usuario = await this.authModel.buscarUsuarioPorNombre(nombre_usuario);

    if (!usuario || usuario.activo === 0) {
      throw new ErrorResponse('Usuario no encontrado o inactivo.', 401);
    }

    const passwordOk = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!passwordOk) {
      throw new ErrorResponse('Contraseña incorrecta.', 401);
    }

    const rolId = usuario.tipo_usuario;
    const rol = obtenerNombreRol[rolId] || 'desconocido';

    const token = JWTHelper.generar({
      usuario_id: usuario.usuario_id,
      nombre_usuario: usuario.nombre_usuario,
      tipo_usuario: rolId,
      rol,
    });

    return {
      token,
      usuario: {
        id: usuario.usuario_id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        nombre_usuario: usuario.nombre_usuario,
        rol,
      },
    };
  }

  validarToken = async (token) => {
    if (!token) {
      throw new ErrorResponse('Token no proporcionado.', 401);
    }

    try {
      const decoded = JWTHelper.verificar(token);
      return decoded;
    } catch (error) {
      console.error('Error en validarToken:', error.message);
      throw new ErrorResponse('Token inválido o expirado.', 403);
    }
  }
}
