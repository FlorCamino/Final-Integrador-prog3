export const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    console.log('🔐 Rol del usuario autenticado:', req.usuario?.rol);
    console.log('✅ Roles permitidos para este endpoint:', rolesPermitidos);
    
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        mensaje: `Acceso denegado. Se requiere uno de los roles: ${rolesPermitidos.join(', ')}`,
      });
    }

    next();
  };
};
