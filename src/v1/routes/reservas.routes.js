import express from 'express';

import { FieldsValidator } from '../../middlewares/validators/campos.validator.js';
import { validarCreacionReserva, validarActualizacionReserva, validarReservaIdParam } from '../../middlewares/validators/reservas.validator.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { GetCache } from '../../middlewares/cache/GetCacheMiddleware.js';
import { ROLES  } from '../../constants/roles.js';
import MulterConfig from '../../config/multerConfig.js';

import ReservasController from '../../controllers/reservas.controller.js';

const router = express.Router();
const controller = new ReservasController();
const multerConfig = new MulterConfig();

router.get(
    '/',
    [
        RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
        GetCache('1 minutes')
    ],
    (req, res, next) => controller.obtenerReservas(req, res, next)
);

router.get(
    '/:id',
    [
        RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
        GetCache('1 minutes'),
        ...validarReservaIdParam,
        FieldsValidator.validate,
    ],
    (req, res, next) => controller.obtenerReservaPorId(req, res, next)
);

router.post(
  '/',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.CLIENTE]),
    multerConfig.uploader.fields([{ name: 'foto_cumpleaniero', maxCount: 1 }]),
    ...validarCreacionReserva,
  ],
  (req, res, next) => controller.crearReserva(req, res, next)
);
router.put(
  '/:reserva_id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    multerConfig.uploader.fields([{ name: 'foto_cumpleaniero', maxCount: 1 }]),
    ...validarActualizacionReserva,
  ],
  (req, res, next) => controller.modificarReserva(req, res, next)
);

router.delete (
    '/:reserva_id',
    [
        RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
        ...validarReservaIdParam,
        FieldsValidator.validate,
    ],
    (req, res, next) => controller.eliminarReserva(req, res, next)
);

export default router;