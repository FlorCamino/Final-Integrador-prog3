import { body, param, validationResult } from 'express-validator';
import { ResponseBuilder } from '../../utils/responseBuilder.js';
import { ErrorResponse } from '../../utils/errorResponse.js';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mensajes = errors.array().map(err => err.msg).join(' ');
    return ResponseBuilder.handleError(res, new ErrorResponse(mensajes, 400));
  }
  next();
};

export const validarCreacionComentario = [
  body('reserva_id')
    .notEmpty().withMessage('El ID de la reserva es obligatorio.')
    .isInt({ min: 1 }).withMessage('El ID de la reserva debe ser un número entero válido.'),
  body('usuario_id')
    .notEmpty().withMessage('El ID del usuario es obligatorio.')
    .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero válido.'),
  body('comentario')
    .trim()
    .notEmpty().withMessage('El comentario no puede estar vacío.')
    .isString().withMessage('El comentario debe ser una cadena de texto.')
    .isLength({ max: 1000 }).withMessage('El comentario no puede superar los 1000 caracteres.'),
  body('calificacion')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación debe ser un número entre 1 y 5.'),
  handleValidation,
];

export const validarReservaIdParam = [
  param('reserva_id')
    .notEmpty().withMessage('Debe proporcionar el ID de la reserva.')
    .isInt({ min: 1 }).withMessage('El ID de la reserva debe ser un número entero válido.'),
  handleValidation,
];

export const validarComentarioIdParam = [
  param('comentario_id')
    .notEmpty().withMessage('Debe proporcionar el ID del comentario.')
    .isInt({ min: 1 }).withMessage('El ID del comentario debe ser un número entero válido.'),
  handleValidation,
];
