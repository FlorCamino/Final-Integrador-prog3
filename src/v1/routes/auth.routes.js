import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { ResponseBuilder } from '../../utils/responseBuilder.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

process.loadEnvFile();
const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, usuario, info) => {
    if (err) {
      console.error('Error en autenticación:', err);
      return next(new ErrorResponse('Error en el servidor durante la autenticación', 500));
    }

    if (!usuario) {
      return next(new ErrorResponse(info?.message || 'Credenciales inválidas', 401));
    }

    const payload = {
      usuario_id: usuario.usuario_id,
      tipo_usuario: usuario.tipo_usuario,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return ResponseBuilder.success(res, {
      token,
      usuario: {
        usuario_id: usuario.usuario_id,
        nombre_usuario: usuario.nombre_usuario,
        tipo_usuario: usuario.tipo_usuario,
      },
    }, 'Login exitoso');
  })(req, res, next);
});

export default router;
