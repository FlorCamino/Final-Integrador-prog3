import { Router } from 'express';
import passport from 'passport';
import InformesController from '../../controllers/informes.controller.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { ROLES } from '../../constants/roles.js';

const controller = new InformesController();
const router = Router();

router.get(
  '/estadisticas',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  (req, res, next) => controller.obtenerEstadisticas(req, res, next)
);

export default router;
