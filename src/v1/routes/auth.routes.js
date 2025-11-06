import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { ResponseBuilder } from '../../utils/responseBuilder.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

process.loadEnvFile();
const router = express.Router();

const validarLogin = [
  body('nombre_usuario')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es obligatorio.'),
  body('contrasenia')
    .trim()
    .notEmpty().withMessage('La contraseña es obligatoria.'),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      
      const mensajes = errores.array().map(e => e.msg).join(' ');
      return ResponseBuilder.handleError(
        res,
        new ErrorResponse(mensajes, 400)
      );
    }
    next();
  },
];

router.post('/login', validarLogin, (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, usuario, info) => {
    if (err) {
      console.error('Error en autenticación:', err);
      return ResponseBuilder.handleError(
        res,
        new ErrorResponse('Error interno durante la autenticación.', 500)
      );
    }

    if (!usuario) {
      return ResponseBuilder.handleError(
        res,
        new ErrorResponse(info?.message || 'Credenciales inválidas.', 401)
      );
    }

    try {
      const payload = {
        usuario_id: usuario.usuario_id,
        tipo_usuario: usuario.tipo_usuario,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
      });

      return ResponseBuilder.success(
        res,
        {
          token,
          usuario: {
            usuario_id: usuario.usuario_id,
            nombre_usuario: usuario.nombre_usuario,
            tipo_usuario: usuario.tipo_usuario,
          },
        },
        'Login exitoso'
      );
    } catch (error) {
      console.error('Error al generar token:', error);
      return ResponseBuilder.handleError(
        res,
        new ErrorResponse('Error al generar el token de autenticación.', 500)
      );
    }
  })(req, res, next);
});

export default router;
