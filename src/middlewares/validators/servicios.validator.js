import { body, param, validationResult, oneOf } from 'express-validator';

export const validarCreacionServicio = [
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  body('importe').isFloat({ min: 0 }).withMessage('El importe debe ser un número positivo'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
    next();
  },
];

export const validarActualizacionServicio = [
  param('servicio_id').isInt().withMessage('El ID del servicio debe ser un número entero'),
  body('descripcion').optional().isString(),
  body('importe').optional().isFloat({ min: 0 }),
  body('activo').optional().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
    next();
  },
];

export const validarServicioIdParam = [
  oneOf([
    param('id').isInt(),
    param('servicio_id').isInt(),
  ], 'El ID del servicio debe ser un número entero'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
    next();
  },
];
