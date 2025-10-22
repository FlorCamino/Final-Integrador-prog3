import express from 'express';
import { check } from 'express-validator';

import { JWTMiddleware } from '../../middlewares/auth/JWTMiddleware.js';
import { RoleMiddleware } from '../../middlewares/auth/RoleMiddleware.js';
import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { ROLES  } from '../../enums/roles.js';

import UsuariosController from '../../controllers/usuarios.controller.js';
import { validarCreacionUsuario, validarActualizacionUsuario } from '../../middlewares/usuarios.validator.js';

const router = express.Router();
const controller = new UsuariosController();

router.get(
  '/',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
  ],
  (req, res) => controller.obtenerUsuarios(req, res)
);

router.get(
  '/:id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR, ROLES.EMPLEADO),
    check('id', 'El ID debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.obtenerUsuarioPorId(req, res)
);

router.post(
  '/',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('apellido', 'El apellido es obligatorio').notEmpty(),
    check('nombre_usuario', 'El nombre de usuario es obligatorio').notEmpty(),
    check('contrasenia', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('tipo_usuario', 'El tipo de usuario debe ser numérico').isInt(),
    check('celular')
      .optional()
      .isString()
      .isLength({ min: 7, max: 20 })
      .withMessage('El celular debe tener entre 7 y 20 caracteres'),
    FieldsValidator.validate,
  ],
  (req, res) => controller.crearUsuario(req, res)
);

router.put(
  '/:id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR),
    check('id', 'El ID debe ser un número válido').isInt(),
    check('nombre').optional().notEmpty(),
    check('apellido').optional().notEmpty(),
    check('nombre_usuario').optional().notEmpty(),
    check('contrasenia').optional().isLength({ min: 6 }),
    check('tipo_usuario').optional().isInt(),
    check('celular').optional().isString(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.modificarUsuario(req, res)
);

router.delete(
  '/:id',
  [
    JWTMiddleware.verificar,
    RoleMiddleware.verificar(ROLES.ADMINISTRADOR),
    check('id', 'El ID debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res) => controller.eliminarUsuario(req, res)
);

export default router;
