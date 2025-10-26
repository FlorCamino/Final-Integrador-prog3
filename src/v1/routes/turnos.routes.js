import express from 'express';
import passport from 'passport';
import { check } from 'express-validator';

import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { RoleCheck } from '../../middlewares/auth/roleCheck.js';
import { ROLES } from '../../enums/roles.js';
import TurnosController from '../../controllers/turno.controller.js';

const router = express.Router();
const controller = new TurnosController();

router.get('/', 
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE])
  ],
  (req, res, next) => controller.obtenerTurnos(req, res, next));

router.get(
  '/:id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
    check('id', 'El ID del turno debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.obtenerTurnoPorId(req, res, next)
);

router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    check('orden', 'El campo "orden" es obligatorio y debe ser numérico').isInt(),
    check('hora_desde', 'La hora de inicio es obligatoria (formato HH:mm)').matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    ),
    check('hora_hasta', 'La hora de fin es obligatoria (formato HH:mm)').matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    ),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.crearTurno(req, res, next)
);

router.put(
  '/:id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    check('id', 'El ID del turno debe ser un número válido').isInt(),
    check('orden').optional().isInt(),
    check('hora_desde')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Formato de hora inválido (HH:mm)'),
    check('hora_hasta')
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Formato de hora inválido (HH:mm)'),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.modificarTurno(req, res, next)
);

router.delete(
  '/:id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    check('id', 'El ID del turno debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.eliminarTurno(req, res, next)
);

export default router;
