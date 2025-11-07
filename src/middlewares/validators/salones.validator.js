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

export const validarCreacionSalon = [
  body('titulo')
    .notEmpty().withMessage('El título es obligatorio.')
    .isString().withMessage('El título debe ser texto.'),

  body('direccion')
    .notEmpty().withMessage('La dirección es obligatoria.')
    .isString().withMessage('La dirección debe ser texto.'),

  body('latitud')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('La latitud debe estar entre -90 y 90.'),

  body('longitud')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('La longitud debe estar entre -180 y 180.'),

  body('capacidad')
    .notEmpty().withMessage('La capacidad es obligatoria.')
    .isInt({ min: 1 }).withMessage('La capacidad debe ser un número mayor que 0.'),

  body('importe')
    .notEmpty().withMessage('El importe es obligatorio.')
    .isFloat({ min: 0 }).withMessage('El importe debe ser un número positivo.'),

  handleValidation,
];

export const validarActualizacionSalon = [
  param('salon_id')
    .isInt({ min: 1 }).withMessage('El ID del salón debe ser un número entero válido.'),

  body('titulo')
    .optional()
    .isString().withMessage('El título debe ser texto.'),

  body('direccion')
    .optional()
    .isString().withMessage('La dirección debe ser texto.'),

  body('latitud')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('La latitud debe estar entre -90 y 90.'),

  body('longitud')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('La longitud debe estar entre -180 y 180.'),

  body('capacidad')
    .optional()
    .isInt({ min: 1 }).withMessage('La capacidad debe ser un número mayor que 0.'),

  body('importe')
    .optional()
    .isFloat({ min: 0 }).withMessage('El importe debe ser un número positivo.'),

  body('activo')
    .optional()
    .isBoolean().withMessage('El campo activo debe ser booleano.'),

  handleValidation,
];

export const validarSalonIdParam = [
  oneOf(
    [param('id').isInt({ min: 1 }), param('salon_id').isInt({ min: 1 })],
    'El ID del salón debe ser un número entero válido.'
  ),
  handleValidation,
];
