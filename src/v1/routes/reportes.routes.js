import express from 'express';
import passport from 'passport';
import { ROLES } from '../../constants/roles.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { GetCache } from '../../middlewares/cache/GetCacheMiddleware.js';
import ReportesController from '../../controllers/reportes.controller.js';
import { query, param, validationResult } from 'express-validator';

const router = express.Router();
const reportesController = new ReportesController();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Errores de validación',
      errores: errors.array(),
    });
  }
  next();
};

const validarRangoFechas = [
  query('desde')
    .notEmpty().withMessage('La fecha "desde" es obligatoria')
    .isDate().withMessage('La fecha "desde" debe tener formato válido (YYYY-MM-DD)'),
  query('hasta')
    .notEmpty().withMessage('La fecha "hasta" es obligatoria')
    .isDate().withMessage('La fecha "hasta" debe tener formato válido (YYYY-MM-DD)'),
  handleValidation,
];

const validarIdReserva = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de reserva debe ser un número entero válido'),
  handleValidation,
];

router.get(
  '/reservas/excel',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  validarRangoFechas,
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarExcel(req, res, next)
);

router.get(
  '/reservas/csv',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  validarRangoFechas,
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarCSV(req, res, next)
);

router.get(
  '/reservas/pdf',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  validarRangoFechas,
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarPDF(req, res, next)
);

router.get(
  '/reservas/pdf/:id',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  validarIdReserva,
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarPDFIndividual(req, res, next)
);

export default router;
