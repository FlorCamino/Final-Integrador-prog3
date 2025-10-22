import { ResponseBuilder } from '../../utils/responseBuilder.js';
import { ErrorResponse } from '../../utils/errorResponse.js';
import { obtenerNombreRol } from '../../enums/roles.js';

export class RoleMiddleware {
  static verificar(...rolesPermitidos) {
    return (req, res, next) => {
      if (!req.usuario) {
        return ResponseBuilder.handleError(res, new ErrorResponse('Usuario no autenticado', 401));
      }

      const rolUsuario = req.usuario.tipo_usuario;
      const nombreRolUsuario = obtenerNombreRol(rolUsuario);

      const rolesRequeridos = rolesPermitidos.map(obtenerNombreRol).join(', ');

      if (!rolesPermitidos.includes(rolUsuario)) {
        console.log('Rol usuario:', rolUsuario, '| Roles permitidos:', rolesPermitidos);

        const mensaje = `Acceso denegado. Tu rol actual es "${nombreRolUsuario}". Roles permitidos: ${rolesRequeridos}.`;
        return ResponseBuilder.handleError(res, new ErrorResponse(mensaje, 403));
      }

      next();
    };
  }
}
