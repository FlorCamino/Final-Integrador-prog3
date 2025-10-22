import express from 'express';
import { JWTMiddleware } from '../../middlewares/auth/JWTMiddleware.js';
import { RoleMiddleware } from '../../middlewares/auth/RoleMiddleware.js';
import { ROLES } from '../../enums/roles.js';
import ReportesController from '../../controllers/reportes.controller.js';

const router = express.Router();
const controller = new ReportesController();


router.get(
  '/reservas',
  [JWTMiddleware.verificar, RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO)],
  controller.generarExcel
);

router.get(
  '/reservas/csv',
  [JWTMiddleware.verificar, RoleMiddleware.verificar(ROLES.ADMINISTRADOR)],
  controller.generarCSV
);

export default router;
