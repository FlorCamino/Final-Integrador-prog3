import { body, param, validationResult, oneOf } from 'express-validator';

export const validarCreacionTurno = [
  body('orden').isInt({ min: 1 }).withMessage('El orden debe ser un número entero positivo'),
  body('hora_desde').matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora_desde inválido (HH:mm)'),
  body('hora_hasta').matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/).withMessage('Formato de hora_hasta inválido (HH:mm)'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
    next();
  },
];

export const validarActualizacionTurno = [
  oneOf([
    param('id').isInt(),
    param('turno_id').isInt(),
  ], 'El ID debe ser un número entero'),
  body('orden').optional().isInt({ min: 1 }),
  body('hora_desde').optional().matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
  body('hora_hasta').optional().matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
  body('activo').optional().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
    next();
  },
];
