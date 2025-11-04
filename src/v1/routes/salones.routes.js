import express from 'express';
import passport from 'passport';
import { FieldsValidator } from '../../middlewares/validators/campos.validator.js';
import { validarCreacionSalon, validarActualizacionSalon, validarSalonIdParam } from '../../middlewares/validators/salones.validator.js';
import { ROLES } from '../../constants/roles.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import SalonesController from '../../controllers/salones.controller.js';

const router = express.Router();
const controller = new SalonesController();

router.get('/', 
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE])
  ],
  (req, res, next) => controller.obtenerSalones(req, res, next)
);

router.get(
  '/:id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
    ...validarSalonIdParam,
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.obtenerSalonPorId(req, res, next)
);

router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarCreacionSalon,
  ],
  (req, res, next) => controller.crearSalon(req, res, next)
);

router.put(
  '/:salon_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarActualizacionSalon,
  ],
  (req, res, next) => controller.modificarSalon(req, res, next)
);

router.delete(
  '/:salon_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarSalonIdParam,
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.eliminarSalon(req, res, next)
);

export default router;
