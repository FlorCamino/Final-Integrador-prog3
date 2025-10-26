import express from 'express';
import passport from 'passport';
import { ROLES } from '../../enums/roles.js';
import { RoleCheck } from '../../middlewares/auth/roleCheck.js';
import ReportesController from '../../controllers/reportes.controller.js';

const router = express.Router();
const controller = new ReportesController();

router.get(
  '/reservas/excel',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
  ],
  (req, res, next) => controller.generarExcel(req, res, next)
);

router.get(
  '/reservas/csv',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
  ],
  (req, res, next) => controller.generarCSV(req, res, next)
);

router.get(
  '/reservas/pdf',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
  ],
  (req, res, next) => controller.generarPDF(req, res, next)
);

export default router;
