import express from 'express';
import { FieldsValidator } from '../../middlewares/validators/campos.validator.js';
import { validarCreacionTurno, validarActualizacionTurno } from '../../middlewares/validators/turnos.validator.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { GetCache } from '../../middlewares/cache/GetCacheMiddleware.js';
import { ROLES } from '../../constants/roles.js';
import TurnosController from '../../controllers/turno.controller.js';

const router = express.Router();
const controller = new TurnosController();

router.get('/', 
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
    GetCache('1 minutes'),
  ],
  (req, res, next) => controller.obtenerTurnos(req, res, next));

router.get(
  '/:id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
    GetCache('1 minutes'),
    ...validarActualizacionTurno.slice(0, 1),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.obtenerTurnoPorId(req, res, next)
);

router.post(
  '/',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarCreacionTurno,
  ],
  (req, res, next) => controller.crearTurno(req, res, next)
);

router.put(
  '/:id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarActualizacionTurno,
  ],
  (req, res, next) => controller.modificarTurno(req, res, next)
);

router.delete(
  '/:id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarActualizacionTurno.slice(0, 1),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.eliminarTurno(req, res, next)
);

export default router;
