import express from 'express';
import passport from 'passport';
import { ROLES } from '../../constants/roles.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import ReportesController from '../../controllers/reportes.controller.js';
import InformesController from '../../controllers/informes.controller.js';

const router = express.Router();
const reportesController = new ReportesController();
const informesController = new InformesController();

router.get(
  '/reservas/excel',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  (req, res, next) => reportesController.generarExcel(req, res, next)
);

router.get(
  '/reservas/csv',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  (req, res, next) => reportesController.generarCSV(req, res, next)
);

router.get(
  '/reservas/pdf',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  (req, res, next) => reportesController.generarPDF(req, res, next)
);

router.get(
  '/informes/excel',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  (req, res, next) => informesController.exportarInformeExcel(req, res, next)
);

export default router;
