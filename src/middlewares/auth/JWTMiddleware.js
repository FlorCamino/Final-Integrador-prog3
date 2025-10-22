import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ResponseBuilder } from '../../utils/responseBuilder.js';
import { ErrorResponse } from '../../utils/errorResponse.js';
import { obtenerNombreRol } from '../../enums/roles.js';

dotenv.config();

export class JWTMiddleware {
  static verificar(req, res, next) {
    const cabecera = req.headers['authorization'];
    const token = cabecera && cabecera.split(' ')[1];

    if (!token) {
      return ResponseBuilder.handleError(res, new ErrorResponse('Token no proporcionado', 401));
    }

    try {
      const decodificado = jwt.verify(token, process.env.JWT_SECRET);

      const tipoUsuario = Number(decodificado.tipo_usuario);

      req.usuario = {
        ...decodificado,
        tipo_usuario: tipoUsuario,
        rol_nombre: obtenerNombreRol(tipoUsuario),
      };

      next();
    } catch (error) {
      const mensaje =
        error.name === 'TokenExpiredError'
          ? 'Token expirado'
          : error.name === 'JsonWebTokenError'
          ? 'Token inválido'
          : 'Error al verificar token';

      return ResponseBuilder.handleError(res, new ErrorResponse(mensaje, 403));
    }
  }
}
