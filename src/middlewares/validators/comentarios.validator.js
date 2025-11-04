import { body, param, validationResult } from 'express-validator';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
  }
  next();
};

export const validarCreacionComentario = [
  body('reserva_id').notEmpty().withMessage('El ID de reserva es obligatorio').isInt().withMessage('El ID de reserva debe ser un número entero'),
  body('usuario_id').notEmpty().withMessage('El ID de usuario es obligatorio').isInt().withMessage('El ID de usuario debe ser un número entero'),
  body('comentario').notEmpty().withMessage('El comentario no puede estar vacío').isString().withMessage('El comentario debe ser texto').isLength({ max: 1000 }).withMessage('El comentario no puede superar los 1000 caracteres'),
  body('calificacion').optional().isInt({ min: 1, max: 5 }).withMessage('La calificación debe ser un número entre 1 y 5'),
  handleValidation,
];

export const validarReservaIdParam = [
  param('reserva_id').isInt().withMessage('El ID de reserva debe ser un número entero'),
  handleValidation,
];

export const validarComentarioIdParam = [
  param('comentario_id').isInt().withMessage('El ID del comentario debe ser un número entero'),
  handleValidation,
];
