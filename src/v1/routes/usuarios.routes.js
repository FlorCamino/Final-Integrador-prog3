import express from 'express';
import passport from 'passport';
import { check } from 'express-validator';

import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';
import { RoleCheck } from '../../middlewares/auth/roleCheck.js';
import { ROLES } from '../../enums/roles.js';
import UsuariosController from '../../controllers/usuarios.controller.js';

const router = express.Router();
const controller = new UsuariosController();

router.get(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
  ],
  (req, res, next) => controller.obtenerUsuarios(req, res, next)
);

router.get(
  '/:id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    check('id', 'El ID debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.obtenerUsuarioPorId(req, res, next)
);

router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
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
  (req, res, next) => controller.crearUsuario(req, res, next)
);

router.put(
  '/:id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    check('id', 'El ID debe ser un número válido').isInt(),
    check('nombre').optional().notEmpty(),
    check('apellido').optional().notEmpty(),
    check('nombre_usuario').optional().notEmpty(),
    check('contrasenia').optional().isLength({ min: 6 }),
    check('tipo_usuario').optional().isInt(),
    check('celular').optional().isString(),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.modificarUsuario(req, res, next)
);

router.delete(
  '/:id',
  [
    passport.authenticate('jwt', { session: false }),
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    check('id', 'El ID debe ser un número válido').isInt(),
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.eliminarUsuario(req, res, next)
);

export default router;
