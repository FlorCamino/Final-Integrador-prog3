import express from 'express';
import passport from 'passport';
import { check } from 'express-validator';

import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
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
    check('id', 'El ID del servicio debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.obtenerServicioPorId(req, res, next)
);

router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    check('descripcion', 'La descripción es obligatoria').notEmpty(),
    check('importe', 'El importe debe ser un número válido').isFloat({ min: 0 }),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.crearServicio(req, res, next)
);

router.put(
  '/:servicio_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    check('servicio_id', 'El ID del servicio debe ser un número válido').isInt(),
    check('descripcion').optional().notEmpty(),
    check('importe').optional().isFloat({ min: 0 }),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.modificarServicio(req, res, next)
);

router.delete(
  '/:servicio_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    check('servicio_id', 'El ID del servicio debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.eliminarServicio(req, res, next)
);

export default router;
