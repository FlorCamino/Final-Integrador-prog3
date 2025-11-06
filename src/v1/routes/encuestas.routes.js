import express from 'express';
import passport from 'passport';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import EncuestasController from '../../controllers/encuestas.controller.js';
import { ROLES } from '../../constants/roles.js';
import {
  validarCreacionEncuesta,
  validarReservaId,
} from '../../middlewares/validators/encuestas.validator.js';

const router = express.Router();
const controller = new EncuestasController();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
  controller.listarEncuestas
);

router.get(
  '/:reserva_id',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
  validarReservaId,
  controller.obtenerPorReserva
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.CLIENTE]),
  validarCreacionEncuesta,
  controller.crearEncuesta
);

router.delete(
  '/:encuesta_id',
  passport.authenticate('jwt', { session: false }),
  RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  controller.eliminarEncuesta
);

export default router;
