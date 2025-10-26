import express from 'express';
import passport from 'passport';
import { check } from 'express-validator';

import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
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
    check('reserva_id', 'El ID de la reserva debe ser válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.obtenerPorReserva(req, res)
);

router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    check('reserva_id', 'El ID de la reserva es obligatorio').notEmpty().isInt(),
    check('comentario', 'El comentario no puede estar vacío')
      .notEmpty()
      .isLength({ min: 3 }),
    check('calificacion')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('La calificación debe ser un número entre 1 y 5'),
    FieldsValidator.validate,
  ],
  (req, res) => controller.crear(req, res)
);

router.delete(
  '/:comentario_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    check('comentario_id', 'El ID del comentario debe ser válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.eliminar(req, res)
);

export default router;
