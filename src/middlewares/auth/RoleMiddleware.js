import passport from 'passport';

export class RoleCheck {
  static verificarRoles(rolesPermitidos = []) {
    return (req, res, next) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Requiere inicio de sesión. Token ausente o inválido.',
        });
      }

      const token = authHeader.split(' ')[1];

      passport.authenticate('jwt', { session: false }, (err, usuario, info) => {
        if (err) {
          console.error('Error en autenticación JWT:', err);
          return res.status(500).json({
            success: false,
            message: 'Error del servidor al verificar autenticación.',
          });
        }

        if (!usuario) {
          let mensaje = 'Token inválido o expirado.';

          if (info?.message?.toLowerCase().includes('expired')) {
            mensaje = 'Token expirado. Inicie sesión nuevamente.';
          } else if (info?.message?.toLowerCase().includes('signature')) {
            mensaje = 'Token inválido. Vuelva a autenticarse.';
          } else if (info?.message) {
            mensaje = info.message;
          }

          return res.status(401).json({ success: false, message: mensaje });
        }

        if (
          rolesPermitidos.length > 0 &&
          !rolesPermitidos.includes(usuario.tipo_usuario)
        ) {
          return res.status(403).json({
            success: false,
            message:
              'Acceso denegado. No tiene permisos suficientes para realizar esta acción.',
          });
        }

        req.user = usuario;
        next();
      })(req, res, next);
    };
  }
}
