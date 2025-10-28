import { body, param, validationResult, oneOf } from 'express-validator';

export const validarCreacionReserva = [
    body('fecha_reserva')
        .notEmpty().withMessage('La fecha de reserva es obligatoria')
        .isDate().withMessage('La fecha de reserva debe estar escrita en formato AAAA-MM-DD'),
    body('salon_id')
        .notEmpty().withMessage('El ID de salon es obligatorio')
        .isInt({min: 1}).withMessage('El ID debe ser un número entero'),
    body('usuario_id')
        .notEmpty().withMessage('El ID de usuario es obligatorio')
        .isInt({min: 1}).withMessage('El ID debe ser un número entero'),
    body('turno_id')
        .notEmpty().withMessage('El ID de turno es obligatorio')
        .isInt({min: 1}).withMessage('El ID de turno debe ser un número entero'),
    body('foto_cumpleaniero')
        .optional()
        .isURL().withMessage('La foto de cumpleañero debe ser un URL'),
    body('tematica')
        .optional()
        .isString().withMessage('La temática debe ser texto'),
    body('importe_salon')
        .optional()
        .isFloat({min: 0}).withMessage('El importe de salón debe ser un número positivo'),
    body('importe_total')
        .optional()
        .isFloat({min: 0}).withMessage('El importe total debe ser un número positivo'),
    body('servicios')
        .optional()
        .isArray().withMessage('Los servicios debe ser un array'),
    body('servicios.*.servicio_id')
        .if(body('servicios').exists())
        .exists().withMessage('El ID de servicio es obligatorio')
        .isInt({min: 1}).withMessage('El ID de servicio debe ser un número entero'),
    body('servicios.*.importe')
        .if(body('servicios').exists())
        .exists().withMessage('El importe es obligatorio')
        .isFloat({min: 0}).withMessage('El importe debe ser un número positivo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
        next();
    },
];

export const validarReservaIdParam = [
    oneOf([
        param('id').isInt(),
        param('reserva_id').isInt(),
    ], 'El ID de reserva debe ser un número entero'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
        next();
    },
];

export const validarActualizacionReserva = [
    param('reserva_id').isInt().withMessage('El ID debe ser un número entero'),
    body('fecha_reserva').optional().isDate().withMessage('La fecha de reserva debe estar escrita en formato AAAA-MM-DD'),
    body('salon_id').optional().isInt().withMessage('El ID debe ser un número entero'),
    body('usuario_id').optional().isInt().withMessage('El ID debe ser un número entero'),
    body('turno_id').optional().isInt().withMessage('El ID de turno debe ser un número entero'),
    body('foto_cumpleaniero').optional().isURL().withMessage('La foto de cumpleañero debe ser url'),
    body('tematica').optional().isString().withMessage('La temática debe ser texto'),
    body('importe_salon').optional().isFloat().withMessage('El importe de salón debe ser un número positivo'),
    body('importe_total').optional().isFloat().withMessage('El importe total debe ser un número positivo'),
    body('servicios').optional().isArray().withMessage('Los servicios debe ser un array'),
    body('servicios.*.servicio_id').optional().isInt({min: 1}).withMessage('El ID de servicio debe ser un número entero'),
    body('servicios.*.importe').optional().isFloat({min: 0}).withMessage('El importe debe ser un número positivo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ ok: false, mensaje: 'Errores de validación', errores: errors.array() });
        next();
    },
];