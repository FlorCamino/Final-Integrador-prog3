import express from 'express';
import { check } from 'express-validator';

import { JWTMiddleware } from '../../middlewares/auth/JWTMiddleware.js';
import { RoleMiddleware } from '../../middlewares/auth/RoleMiddleware.js';
import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { ROLES  } from '../../enums/roles.js';

import SalonesController from '../../controllers/salones.controller.js';

const router = express.Router();
const controller = new SalonesController();

router.get(
  '/',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.CLIENTE, ROLES.EMPLEADO, ROLES.ADMINISTRADOR),
  ],
  (req, res) => controller.obtenerSalones(req, res)
);

router.get(
  '/:id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.CLIENTE, ROLES.EMPLEADO, ROLES.ADMINISTRADOR),
    check('id', 'El ID del salón debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.obtenerSalonPorId(req, res)
);

router.post(
  '/',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('titulo', 'El título es obligatorio').notEmpty(),
    check('direccion', 'La dirección es obligatoria').notEmpty(),
    check('capacidad', 'La capacidad debe ser un número válido').isInt({ min: 1 }),
    check('importe', 'El importe debe ser un número válido').isFloat({ min: 0 }),
    FieldsValidator.validate,
  ],
  (req, res) => controller.crearSalon(req, res)
);

router.put(
  '/:salon_id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('salon_id', 'El ID del salón es obligatorio y debe ser numérico').isInt(),
    check('titulo').optional().notEmpty(),
    check('direccion').optional().notEmpty(),
    check('capacidad').optional().isInt({ min: 1 }),
    check('importe').optional().isFloat({ min: 0 }),
    FieldsValidator.validate,
  ],
  (req, res) => controller.modificarSalon(req, res)
);

router.delete(
  '/:salon_id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('salon_id', 'El ID del salón debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.eliminarSalon(req, res)
);

export default router;
