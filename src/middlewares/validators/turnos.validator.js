import { body, param, oneOf, validationResult } from 'express-validator';
import { ResponseBuilder } from '../../utils/responseBuilder.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mensajes = errors.array().map(e => e.msg).join(' ');
    return ResponseBuilder.handleError(res, new ErrorResponse(mensajes, 400));
  }
  next();
};

export const validarCreacionTurno = [
  body('orden')
    .notEmpty().withMessage('El campo "orden" es obligatorio.')
    .isInt({ min: 1 }).withMessage('El orden debe ser un número entero positivo.'),

  body('hora_desde')
    .notEmpty().withMessage('El campo "hora_desde" es obligatorio.')
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('El campo "hora_desde" debe tener formato válido (HH:mm).'),

  body('hora_hasta')
    .notEmpty().withMessage('El campo "hora_hasta" es obligatorio.')
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('El campo "hora_hasta" debe tener formato válido (HH:mm).'),

  handleValidation,
];

export const validarActualizacionTurno = [
  oneOf(
    [param('id').isInt({ min: 1 }), param('turno_id').isInt({ min: 1 })],
    'El ID del turno debe ser un número entero válido.'
  ),

  body('orden')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El campo "orden" debe ser un número entero positivo.'),

  body('hora_desde')
    .optional()
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('El campo "hora_desde" debe tener formato válido (HH:mm).'),

  body('hora_hasta')
    .optional()
    .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('El campo "hora_hasta" debe tener formato válido (HH:mm).'),

  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo "activo" debe ser booleano.'),

  handleValidation,
];
