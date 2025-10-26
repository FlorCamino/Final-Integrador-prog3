import express from 'express';
import passport from 'passport';
import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { validarCreacionServicio, validarActualizacionServicio, validarServicioIdParam } from '../../middlewares/validators/servicios.validator.js';
import { RoleCheck } from '../../middlewares/auth/roleCheck.js';
import { ROLES } from '../../enums/roles.js';
import ServiciosController from '../../controllers/servicios.controller.js';

const router = express.Router();
const controller = new ServiciosController();

router.get('/',
  [ 
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
  ],
  (req, res, next) => controller.obtenerServicios(req, res, next));

router.get(
  '/:id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
    ...validarServicioIdParam,
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.obtenerServicioPorId(req, res, next)
);

router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarCreacionServicio,
  ],
  (req, res, next) => controller.crearServicio(req, res, next)
);

router.put(
  '/:servicio_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarActualizacionServicio,
  ],
  (req, res, next) => controller.modificarServicio(req, res, next)
);

router.delete(
  '/:servicio_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarServicioIdParam,
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.eliminarServicio(req, res, next)
);

export default router;
