import { body, validationResult } from 'express-validator';
import { ResponseBuilder } from '../../utils/responseBuilder.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

export const validarLogin = [
  body('nombre_usuario')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es obligatorio.')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres.'),

  body('contrasenia')
    .trim()
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 4 })
    .withMessage('La contraseña debe tener al menos 4 caracteres.'),

  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      const mensajes = errores.array().map(e => e.msg).join(' ');
      return ResponseBuilder.handleError(res, new ErrorResponse(mensajes, 400));
    }
    next();
  },
];
