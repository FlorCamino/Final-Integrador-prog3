import express from 'express';
import { check } from 'express-validator';

import { JWTMiddleware } from '../../middlewares/auth/JWTMiddleware.js';
import { RoleMiddleware } from '../../middlewares/auth/RoleMiddleware.js';
import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { ROLES } from '../../enums/roles.js';

import ComentariosController from '../../controllers/comentarios.controller.js';

const router = express.Router();
const controller = new ComentariosController();

router.get(
  '/:reserva_id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE),
  ],
  (req, res) => controller.obtenerPorReserva(req, res)
);

router.post(
  '/',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('reserva_id', 'El ID de la reserva es obligatorio').notEmpty().isInt(),
    check('usuario_id', 'El ID del usuario es obligatorio').notEmpty().isInt(),
    check('comentario', 'El comentario no puede estar vacío').notEmpty().isLength({ min: 3 }),
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
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('comentario_id', 'El ID del comentario es obligatorio').notEmpty().isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.eliminar(req, res)
);

export default router;
