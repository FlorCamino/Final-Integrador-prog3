import { body, param, validationResult } from 'express-validator';

const reservaIdChain = body('reserva_id')
  .notEmpty().withMessage('El ID de reserva es obligatorio')
  .isInt().withMessage('El ID de reserva debe ser un número entero');

const usuarioIdChain = body('usuario_id')
  .notEmpty().withMessage('El ID de usuario es obligatorio')
  .isInt().withMessage('El ID de usuario debe ser un número entero');

const comentarioChain = body('comentario')
  .notEmpty().withMessage('El comentario no puede estar vacío')
  .isString().withMessage('El comentario debe ser texto')
  .isLength({ max: 1000 }).withMessage('El comentario no puede superar los 1000 caracteres');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

export const validarCreacionComentario = [
  reservaIdChain,
  usuarioIdChain,
  comentarioChain,
  handleValidation,
];

export const validarReservaIdParam = [
  param('reserva_id').isInt().withMessage('El ID de reserva debe ser un número entero'),
  handleValidation,
];
