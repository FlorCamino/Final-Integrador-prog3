export const attachUsuarioId = (req, res, next) => {
  try {
    if (req.usuario && req.usuario.id) req.body.usuario_id = req.usuario.id;
  } catch (e) {
    // No hacer nada si ocurre un error
  }
  next();
};
