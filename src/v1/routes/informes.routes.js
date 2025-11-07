import express from 'express';
import InformesController from '../../controllers/informes.controller.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { GetCache } from '../../middlewares/cache/GetCacheMiddleware.js';
import { ROLES } from '../../constants/roles.js';
import { validarFechasInforme } from '../../middlewares/validators/informes.validator.js';

const informesController = new InformesController();
const router = express.Router();

router.get(
  '/estadisticas',
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  GetCache('1 minutes'),
  ...validarFechasInforme,
  (req, res, next) => informesController.obtenerEstadisticas(req, res, next)
);

router.get(
  '/excel',
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  GetCache('1 minutes'),
  ...validarFechasInforme,
  (req, res, next) => informesController.exportarInformeExcel(req, res, next)
);

export default router;
