import { validationResult } from 'express-validator';

export class FieldsValidator {
  static validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Errores de validación',
        errores: errors.array(),
      });
    }
    next();
  }
}
