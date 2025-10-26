import { body, param, validationResult } from 'express-validator';

export const validarCreacionUsuario = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser texto'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio').isString().withMessage('El apellido debe ser texto'),
  body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio').isString().withMessage('Debe ser texto'),
  body('contrasenia').notEmpty().withMessage('La contraseña es obligatoria').isLength({ min: 6 }).withMessage('Debe tener al menos 6 caracteres'),
  body('tipo_usuario').notEmpty().withMessage('El tipo de usuario es obligatorio').isInt({ min: 1, max: 3 }).withMessage('Debe ser un número válido (1=adm,2=empleado,3=cliente)'),
  body('celular').optional().isString().withMessage('El celular debe ser texto'),
  body('foto').optional().isString().withMessage('La foto debe ser texto'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
    next();
  },
];

export const validarActualizacionUsuario = [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  body('nombre').optional().isString(),
  body('apellido').optional().isString(),
  body('nombre_usuario').optional().isString(),
  body('contrasenia').optional().isLength({ min: 6 }),
  body('tipo_usuario').optional().isInt({ min: 1, max: 3 }),
  body('celular').optional().isString(),
  body('foto').optional().isString(),
  body('activo').optional().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
    next();
  },
];
