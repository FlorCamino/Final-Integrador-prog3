import express from 'express';
import passport from 'passport';
import InformesController from '../../controllers/informes.controller.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { ROLES } from '../../constants/roles.js';

const informesController = new InformesController();
const router = express.Router();

router.get(
  '/estadisticas',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  (req, res, next) => informesController.obtenerEstadisticas(req, res, next)
);

router.get(
  '/excel',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  (req, res, next) => informesController.exportarInformeExcel(req, res, next)
);

export default router;
