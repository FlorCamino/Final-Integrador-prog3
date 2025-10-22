import express from 'express';
import { check } from 'express-validator';

import { JWTMiddleware } from '../../middlewares/auth/JWTMiddleware.js';
import { RoleMiddleware } from '../../middlewares/auth/RoleMiddleware.js';
import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { ROLES  } from '../../enums/roles.js';

import TurnosController from '../../controllers/turno.controller.js';
import { validarCreacionTurno, validarActualizacionTurno } from '../../middlewares/turnos.validator.js';

const router = express.Router();
const controller = new TurnosController();

router.get(
  '/',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.CLIENTE, ROLES.EMPLEADO, ROLES.ADMINISTRADOR),
  ],
  (req, res) => controller.obtenerTurnos(req, res)
);

router.get(
  '/:id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.CLIENTE, ROLES.EMPLEADO, ROLES.ADMINISTRADOR),
    check('id', 'El ID del turno debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.obtenerTurnoPorId(req, res)
);

router.post(
  '/',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('orden', 'El campo "orden" es obligatorio y debe ser numérico').isInt(),
    check('hora_desde', 'La hora de inicio es obligatoria (formato HH:mm)').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    check('hora_hasta', 'La hora de fin es obligatoria (formato HH:mm)').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    FieldsValidator.validate,
  ],
  (req, res) => controller.crearTurno(req, res)
);

router.put(
  '/:id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
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
  (req, res) => controller.modificarTurno(req, res)
);

router.delete(
  '/:id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('id', 'El ID del turno debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.eliminarTurno(req, res)
);

export default router;
