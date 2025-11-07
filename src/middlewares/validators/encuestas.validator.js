import { body, param, validationResult } from 'express-validator';
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

export const validarCreacionEncuesta = [
  body('reserva_id')
    .notEmpty().withMessage('Debe indicar el ID de la reserva.')
    .isInt({ min: 1 }).withMessage('El ID de la reserva debe ser un número entero válido.'),

  body('puntuacion')
    .notEmpty().withMessage('Debe indicar una puntuación.')
    .isInt({ min: 1, max: 5 }).withMessage('La puntuación debe estar entre 1 y 5.'),

  body('comentario')
    .optional({ checkFalsy: true })
    .trim()
    .isString().withMessage('El comentario debe ser texto.')
    .isLength({ max: 500 }).withMessage('El comentario no puede superar los 500 caracteres.'),

  handleValidation,
];

export const validarReservaIdParam = [
  param('reserva_id')
    .notEmpty().withMessage('Debe indicar el ID de la reserva.')
    .isInt({ min: 1 }).withMessage('El ID de la reserva debe ser un número entero válido.'),
  handleValidation,
];

export const validarEncuestaIdParam = [
  param('encuesta_id')
    .notEmpty().withMessage('Debe indicar el ID de la encuesta.')
    .isInt({ min: 1 }).withMessage('El ID de la encuesta debe ser un número entero válido.'),
  handleValidation,
];
