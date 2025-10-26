import { ErrorResponse } from '../../utils/errorResponse.js';

export class RoleCheck {
  static verificarRoles(rolesPermitidos = []) {
    return (req, res, next) => {
      const usuario = req.user;

      if (!usuario) {
        return next(new ErrorResponse('No autenticado. Debe iniciar sesión.', 401));
      }

      if (!rolesPermitidos.includes(usuario.tipo_usuario)) {
        return next(new ErrorResponse('Acceso denegado. Rol no autorizado.', 403));
      }

      next();
    };
  }
}
