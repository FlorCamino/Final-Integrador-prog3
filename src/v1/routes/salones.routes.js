import express from 'express';
import passport from 'passport';
import { check } from 'express-validator';

import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { ROLES } from '../../enums/roles.js';
import { RoleCheck } from '../../middlewares/auth/roleCheck.js';
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
    check('id', 'El ID del salón debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.obtenerSalonPorId(req, res, next)
);

router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    check('titulo', 'El título es obligatorio').notEmpty(),
    check('direccion', 'La dirección es obligatoria').notEmpty(),
    check('capacidad', 'La capacidad debe ser un número válido').isInt({ min: 1 }),
    check('importe', 'El importe debe ser un número válido').isFloat({ min: 0 }),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.crearSalon(req, res, next)
);

router.put(
  '/:salon_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    check('salon_id', 'El ID del salón debe ser numérico').isInt(),
    check('titulo').optional().notEmpty(),
    check('direccion').optional().notEmpty(),
    check('capacidad').optional().isInt({ min: 1 }),
    check('importe').optional().isFloat({ min: 0 }),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.modificarSalon(req, res, next)
);

router.delete(
  '/:salon_id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    check('salon_id', 'El ID del salón debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.eliminarSalon(req, res, next)
);

export default router;
