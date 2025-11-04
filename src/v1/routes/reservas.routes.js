import express from 'express';
import passport from 'passport';

import { FieldsValidator } from '../../middlewares/validators/campos.validator.js';
import { validarCreacionReserva, validarActualizacionReserva, validarReservaIdParam } from '../../middlewares/validators/reservas.validator.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { ROLES  } from '../../constants/roles.js';

import ReservasController from '../../controllers/reservas.controller.js';

const router = express.Router();
const controller = new ReservasController();

router.get(
    '/',
    [
        passport.authenticate('jwt', { session: false }),
        RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE])
    ],
    (req, res, next) => controller.obtenerReservas(req, res, next)
);

router.get(
    '/:id',
    [
        passport.authenticate('jwt', { session: false }),
        RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
        ...validarReservaIdParam,
        FieldsValidator.validate,
    ],
    (req, res, next) => controller.obtenerReservaPorId(req, res, next)
);

router.post(
    '/',
    [
        passport.authenticate('jwt', { session: false }),
        RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.CLIENTE]),
        ...validarCreacionReserva,
    ],
    (req, res, next) => controller.crearReserva(req, res, next)
);

router.put(
    '/:reserva_id',
    [
        passport.authenticate('jwt', { session: false }),
        RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
        ...validarActualizacionReserva,
    ],
    (req, res, next) => controller.modificarReserva(req, res, next)
);

router.delete (
    '/:reserva_id',
    [
        passport.authenticate('jwt', { session: false }),
        RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
        ...validarReservaIdParam,
        FieldsValidator.validate,
    ],
    (req, res, next) => controller.eliminarReserva(req, res, next)
);

export default router;