import express from 'express';
import passport from 'passport';
import { ROLES } from '../../constants/roles.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { GetCache } from '../../middlewares/cache/GetCacheMiddleware.js';
import ReportesController from '../../controllers/reportes.controller.js';
import { validarRangoFechas, validarIdReserva } from '../../middlewares/validators/reportes.validator.js';

const router = express.Router();
const reportesController = new ReportesController();

router.get(
  '/reservas/excel',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  ...validarRangoFechas,
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarExcel(req, res, next)
);

router.get(
  '/reservas/csv',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  ...validarRangoFechas,
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarCSV(req, res, next)
);

router.get(
  '/reservas/pdf',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  ...validarRangoFechas,
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarPDF(req, res, next)
);

router.get(
  '/reservas/pdf/:id',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  ...validarIdReserva,
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarPDFIndividual(req, res, next)
);

export default router;
