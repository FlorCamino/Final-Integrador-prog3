import { query, validationResult } from 'express-validator';
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

export const validarFechasInforme = [
  query('desde')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La fecha "desde" debe tener un formato válido (YYYY-MM-DD).'),

  query('hasta')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('La fecha "hasta" debe tener un formato válido (YYYY-MM-DD).'),

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
