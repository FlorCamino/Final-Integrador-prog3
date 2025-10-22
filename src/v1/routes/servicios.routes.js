import express from 'express';
import { check } from 'express-validator';

import { JWTMiddleware } from '../../middlewares/auth/JWTMiddleware.js';
import { RoleMiddleware } from '../../middlewares/auth/RoleMiddleware.js';
import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { ROLES } from '../../enums/roles.js';

import ServiciosController from '../../controllers/servicios.controller.js';
import { validarCreacionServicio, validarActualizacionServicio } from '../../middlewares/servicios.validator.js';

const router = express.Router();
const controller = new ServiciosController();

router.get(
  '/',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.CLIENTE, ROLES.EMPLEADO, ROLES.ADMINISTRADOR),
  ],
  (req, res) => controller.obtenerServicios(req, res)
);

router.get(
  '/:id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.CLIENTE, ROLES.EMPLEADO, ROLES.ADMINISTRADOR),
    check('id', 'El ID del servicio debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.obtenerServicioPorId(req, res)
);

router.post(
  '/',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('descripcion', 'La descripción es obligatoria').notEmpty(),
    check('importe', 'El importe debe ser un número válido').isFloat({ min: 0 }),
    FieldsValidator.validate,
  ],
  (req, res) => controller.crearServicio(req, res)
);

router.put(
  '/:servicio_id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('servicio_id', 'El ID del servicio debe ser un número válido').isInt(),
    check('descripcion').optional().notEmpty(),
    check('importe').optional().isFloat({ min: 0 }),
    FieldsValidator.validate,
  ],
  (req, res) => controller.modificarServicio(req, res)
);

router.delete(
  '/:servicio_id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('servicio_id', 'El ID del servicio debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.eliminarServicio(req, res)
);

export default router;
