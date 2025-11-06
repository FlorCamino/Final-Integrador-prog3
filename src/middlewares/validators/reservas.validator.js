import { body, param, validationResult, oneOf } from 'express-validator';

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const validarCreacionReserva = [
  body('fecha_reserva')
    .notEmpty().withMessage('La fecha de reserva es obligatoria')
    .isDate().withMessage('La fecha de reserva debe estar escrita en formato AAAA-MM-DD'),
  body('salon_id')
    .notEmpty().withMessage('El ID de salón es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero'),
  body('usuario_id')
    .optional({ checkFalsy: true, nullable: true })
    .isInt({ min: 1 })
    .withMessage('El ID de usuario debe ser un número entero'),
  body('turno_id')
    .notEmpty().withMessage('El ID de turno es obligatorio')
    .isInt({ min: 1 }).withMessage('El ID de turno debe ser un número entero'),
  body('foto_cumpleaniero')
    .custom((_, { req }) => {
      if (req.file) {
        const { mimetype, size } = req.file;
        if (!VALID_IMAGE_TYPES.includes(mimetype)) {
          throw new Error('El archivo de la foto debe ser una imagen válida (jpg, png o gif).');
        }
        if (size > MAX_FILE_SIZE_BYTES) {
          throw new Error(`El archivo supera el tamaño máximo permitido de ${MAX_FILE_SIZE_MB} MB.`);
        }
      }
      return true;
    }),
  body('tematica')
    .optional()
    .isString().withMessage('La temática debe ser texto'),
  body('importe_salon')
    .optional()
    .isFloat({ min: 0 }).withMessage('El importe de salón debe ser un número positivo'),
  body('importe_total')
    .optional()
    .isFloat({ min: 0 }).withMessage('El importe total debe ser un número positivo'),
  body('servicios')
    .custom((value) => {
      if (!value) throw new Error('Debe incluir al menos un servicio.');

      let servicios;
      if (typeof value === 'string') {
        try {
          servicios = JSON.parse(value);
        } catch {
          throw new Error('Formato inválido: los servicios deben estar en JSON válido.');
        }
      } else {
        servicios = value;
      }

      if (!Array.isArray(servicios)) {
        throw new Error('Los servicios deben estar en formato de arreglo.');
      }

      if (servicios.length === 0) {
        throw new Error('Debe incluir al menos un servicio.');
      }

      for (const s of servicios) {
        if (!s.servicio_id || typeof s.servicio_id !== 'number') {
          throw new Error('Cada servicio debe tener un servicio_id numérico.');
        }
        if (typeof s.importe !== 'number') {
          throw new Error('Cada servicio debe tener un importe numérico.');
        }
      }

      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Errores de validación',
        errores: errors.array(),
      });
    }
    next();
  },
];

export const validarReservaIdParam = [
  oneOf(
    [param('id').isInt(), param('reserva_id').isInt()],
    'El ID de reserva debe ser un número entero'
  ),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
    next();
  },
];

export const validarActualizacionReserva = [
  param('reserva_id')
    .isInt().withMessage('El ID debe ser un número entero'),
  body('fecha_reserva')
    .optional()
    .isDate().withMessage('La fecha de reserva debe estar escrita en formato AAAA-MM-DD'),
  body('salon_id')
    .optional()
    .isInt().withMessage('El ID de salón debe ser un número entero'),
  body('usuario_id')
    .optional({ checkFalsy: true, nullable: true })
    .isInt({ min: 1 })
    .withMessage('El ID de usuario debe ser un número entero'),
  body('turno_id')
    .optional()
    .isInt().withMessage('El ID de turno debe ser un número entero'),
  body('foto_cumpleaniero')
    .custom((_, { req }) => {
      if (req.file) {
        const { mimetype, size } = req.file;
        if (!VALID_IMAGE_TYPES.includes(mimetype)) {
          throw new Error('El archivo de la foto debe ser una imagen válida (jpg, png o gif).');
        }
        if (size > MAX_FILE_SIZE_BYTES) {
          throw new Error(`El archivo supera el tamaño máximo permitido de ${MAX_FILE_SIZE_MB} MB.`);
        }
      }
      return true;
    }),
  body('tematica')
    .optional()
    .isString().withMessage('La temática debe ser texto'),
  body('importe_salon')
    .optional()
    .isFloat({ min: 0 }).withMessage('El importe de salón debe ser un número positivo'),
  body('importe_total')
    .optional()
    .isFloat({ min: 0 }).withMessage('El importe total debe ser un número positivo'),
  body('servicios')
    .optional()
    .custom((value) => {
      if (!value) return true;
      let servicios;
      if (typeof value === 'string') {
        try {
          servicios = JSON.parse(value);
        } catch {
          throw new Error('Formato inválido: los servicios deben estar en JSON válido.');
        }
      } else {
        servicios = value;
      }

      if (!Array.isArray(servicios)) {
        throw new Error('Los servicios deben estar en formato de arreglo.');
      }

      for (const s of servicios) {
        if (!s.servicio_id || typeof s.servicio_id !== 'number') {
          throw new Error('Cada servicio debe tener un servicio_id numérico.');
        }
        if (typeof s.importe !== 'number') {
          throw new Error('Cada servicio debe tener un importe numérico.');
        }
      }

      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
    next();
  },
];
