import bcrypt from 'bcryptjs';
import AuthModel from '../models/auth.js';
import { JWTHelper } from '../utils/jwt.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { obtenerNombreRol } from '../enums/roles.js';

export default class AuthService {
  constructor() {
    this.authModel = new AuthModel();
  }

  async login(nombre_usuario, contrasenia) {
    const usuario = await this.authModel.buscarUsuarioPorNombre(nombre_usuario);

    if (!usuario) {
      throw new ErrorResponse('Usuario no encontrado o inactivo', 401);
    }

    const passwordOk = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!passwordOk) {
      throw new ErrorResponse('Contraseña incorrecta', 401);
    }

    const rolId = usuario.tipo_usuario;
    const rol = obtenerNombreRol[rolId] || 'desconocido';

    const token = JWTHelper.generar({
      id: usuario.usuario_id,
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

  async validarToken(token) {
    if (!token) {
      throw new ErrorResponse('Token no proporcionado', 401);
    }

    try {
      return JWTHelper.verificar(token);
    } catch {
      throw new ErrorResponse('Token inválido o expirado', 403);
    }
  }
}
