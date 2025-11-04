import express from 'express';
import passport from 'passport';
import { ROLES } from '../../constants/roles.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { GetCache } from '../../middlewares/cache/GetCacheMiddleware.js';
import ReportesController from '../../controllers/reportes.controller.js';

const router = express.Router();
const reportesController = new ReportesController();

router.get(
  '/reservas/excel',
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarExcel(req, res, next)
);

router.get(
  '/reservas/csv',
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarCSV(req, res, next)
);

router.get(
  '/reservas/pdf',
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarPDF(req, res, next)
);

router.get(
  '/reservas/pdf/:id',
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  GetCache('1 minutes'),
  (req, res, next) => reportesController.generarPDFIndividual(req, res, next)
);

export default router;
