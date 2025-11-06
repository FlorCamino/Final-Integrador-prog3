import { body, param } from 'express-validator';

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
    .escape()
    .isString().withMessage('El comentario debe ser un texto.')
    .isLength({ max: 500 }).withMessage('El comentario no puede superar los 500 caracteres.'),
];

export const validarReservaId = [
  param('reserva_id')
    .notEmpty().withMessage('Debe indicar el ID de la reserva.')
    .isInt({ min: 1 }).withMessage('El ID de la reserva debe ser un número entero válido.'),
];
