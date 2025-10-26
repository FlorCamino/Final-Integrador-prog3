import express from 'express';
import passport from 'passport';
import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { validarReservaIdParam, validarCreacionComentario, validarComentarioIdParam } from '../../middlewares/validators/comentarios.validator.js';
import { ROLES } from '../../enums/roles.js';
import { RoleCheck } from '../../middlewares/auth/roleCheck.js';
import ComentariosController from '../../controllers/comentarios.controller.js';

const router = express.Router();
const controller = new ComentariosController();

router.get(
  '/:reserva_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarReservaIdParam,
  ],
  (req, res) => controller.obtenerPorReserva(req, res)
);

router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarCreacionComentario,
  ],
  (req, res) => controller.crear(req, res)
);

router.delete(
  '/:comentario_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    ...validarComentarioIdParam,
  ],
  (req, res) => controller.eliminar(req, res)
);

export default router;
