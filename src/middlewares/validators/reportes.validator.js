import { query, param, validationResult } from 'express-validator';
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

export const validarRangoFechas = [
  query('desde')
    .notEmpty().withMessage('La fecha "desde" es obligatoria.')
    .isISO8601().withMessage('La fecha "desde" debe tener formato válido (YYYY-MM-DD).'),
  query('hasta')
    .notEmpty().withMessage('La fecha "hasta" es obligatoria.')
    .isISO8601().withMessage('La fecha "hasta" debe tener formato válido (YYYY-MM-DD).'),
  (req, res, next) => {
    const { desde, hasta } = req.query;
    if (desde && hasta && new Date(desde) > new Date(hasta)) {
      return ResponseBuilder.handleError(
        res,
        new ErrorResponse('La fecha inicial no puede ser posterior a la fecha final.', 400)
      );
    }
    next();
  },
  handleValidation,
];

export const validarIdReserva = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de reserva debe ser un número entero válido.'),
  handleValidation,
];
