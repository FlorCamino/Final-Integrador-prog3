import { ErrorResponse } from '../../utils/errorResponse.js';

export class RoleCheck {
  static verificarRoles(rolesPermitidos = []) {
    return (req, res, next) => {
      try {
        const usuario = req.user;

        if (!usuario) {
          return next(new ErrorResponse('No autenticado. Debe iniciar sesión.', 401));
        }

        if (!usuario.tipo_usuario) {
          return next(new ErrorResponse('El usuario no tiene un rol asignado.', 403));
        }

        if (!rolesPermitidos.includes(usuario.tipo_usuario)) {
          return next(new ErrorResponse('Acceso denegado. Rol no autorizado.', 403));
        }

        next();
      } catch (error) {
        next(new ErrorResponse('Error al verificar el rol de usuario.', 500));
      }
    };
  }
}
