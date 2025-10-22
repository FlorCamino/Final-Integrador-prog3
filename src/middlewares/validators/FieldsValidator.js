import { validationResult } from 'express-validator';
import { ResponseBuilder } from '../../utils/responseBuilder.js';

export class FieldsValidator {
  static validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return ResponseBuilder.handleError(
        res,
        'Errores de validación',
        400,
        errors.array().map(e => `${e.path}: ${e.msg}`).join(', ')
      );
    }
    next();
  }
}
