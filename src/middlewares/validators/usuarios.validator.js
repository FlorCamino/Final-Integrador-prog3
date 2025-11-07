import { body, param, validationResult } from 'express-validator';
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

export const validarCreacionUsuario = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isString().withMessage('El nombre debe ser texto.'),

  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio.')
    .isString().withMessage('El apellido debe ser texto.'),

  body('nombre_usuario')
    .notEmpty().withMessage('El nombre de usuario es obligatorio.')
    .isString().withMessage('El nombre de usuario debe ser texto.')
    .isLength({ max: 50 }).withMessage('El nombre de usuario no puede superar los 50 caracteres.'),

  body('contrasenia')
    .if(body('password').not().exists())
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),

  body('tipo_usuario')
    .notEmpty().withMessage('El tipo de usuario es obligatorio.')
    .isInt({ min: 1, max: 3 })
    .withMessage('El tipo de usuario debe ser un número válido (1=Administrador, 2=Empleado, 3=Cliente).'),

  body('celular')
    .optional()
    .isString().withMessage('El celular debe ser texto.'),

  body('foto')
    .optional()
    .isString().withMessage('La foto debe ser una cadena de texto.'),

  handleValidation,
];

export const validarActualizacionUsuario = [
  param('id')
    .isInt({ min: 1 }).withMessage('El ID del usuario debe ser un número entero válido.'),

  body('nombre')
    .optional()
    .isString().withMessage('El nombre debe ser texto.'),

  body('apellido')
    .optional()
    .isString().withMessage('El apellido debe ser texto.'),

  body('nombre_usuario')
    .optional()
    .isString().withMessage('El nombre de usuario debe ser texto.')
    .isLength({ max: 50 }).withMessage('El nombre de usuario no puede superar los 50 caracteres.'),

  body('contrasenia')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),

  body('tipo_usuario')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('El tipo de usuario debe ser un número válido (1=Administrador, 2=Empleado, 3=Cliente).'),

  body('celular')
    .optional()
    .isString().withMessage('El celular debe ser texto.'),

  body('foto')
    .optional()
    .isString().withMessage('La foto debe ser una cadena de texto.'),

  body('activo')
    .optional()
    .isBoolean().withMessage('El campo activo debe ser booleano.'),

  handleValidation,
];
