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

export const validarCreacionServicio = [
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria.')
    .isString().withMessage('La descripción debe ser texto.')
    .isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres.'),

  body('importe')
    .notEmpty().withMessage('El importe es obligatorio.')
    .isFloat({ min: 0 }).withMessage('El importe debe ser un número positivo.'),

  handleValidation,
];

export const validarActualizacionServicio = [
  param('servicio_id')
    .isInt({ min: 1 }).withMessage('El ID del servicio debe ser un número entero válido.'),

  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto.')
    .isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres.'),

  body('importe')
    .optional()
    .isFloat({ min: 0 }).withMessage('El importe debe ser un número positivo.'),

  body('activo')
    .optional()
    .isBoolean().withMessage('El campo activo debe ser booleano.'),

  handleValidation,
];

export const validarServicioIdParam = [
  oneOf(
    [param('id').isInt({ min: 1 }), param('servicio_id').isInt({ min: 1 })],
    'El ID del servicio debe ser un número entero válido.'
  ),
  handleValidation,
];
