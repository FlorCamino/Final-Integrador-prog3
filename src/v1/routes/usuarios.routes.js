import express from 'express';
import { FieldsValidator } from '../../middlewares/validators/campos.validator.js';
import { validarCreacionUsuario, validarActualizacionUsuario } from '../../middlewares/validators/usuarios.validator.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { GetCache } from '../../middlewares/cache/GetCacheMiddleware.js';
import { ROLES } from '../../constants/roles.js';
import UsuariosController from '../../controllers/usuarios.controller.js';

const router = express.Router();
const controller = new UsuariosController();

router.get(
  '/',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    GetCache('1 minutes'),
  ],
  (req, res, next) => controller.obtenerUsuarios(req, res, next)
);

router.get(
  '/:id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    GetCache('1 minutes'),
    validarActualizacionUsuario[0],
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.obtenerUsuarioPorId(req, res, next)
);

router.post(
  '/',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    ...validarCreacionUsuario,
  ],
  (req, res, next) => controller.crearUsuario(req, res, next)
);

router.put(
  '/:id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    ...validarActualizacionUsuario,
  ],
  (req, res, next) => controller.modificarUsuario(req, res, next)
);

router.delete(
  '/:id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    validarActualizacionUsuario[0],
    FieldsValidator.validate,
  ],
  (req, res, next) => controller.eliminarUsuario(req, res, next)
);

export default router;
