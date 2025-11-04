import express from 'express';
import { validarReservaIdParam, validarCreacionComentario, validarComentarioIdParam } from '../../middlewares/validators/comentarios.validator.js';
import { ROLES } from '../../constants/roles.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { GetCache } from '../../middlewares/cache/GetCacheMiddleware.js';
import ComentariosController from '../../controllers/comentarios.controller.js';

const router = express.Router();
const controller = new ComentariosController();

router.get(
  '/:reserva_id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    GetCache('1 minutes'),
    ...validarReservaIdParam,
  ],
  (req, res) => controller.obtenerPorReserva(req, res)
);

router.post(
  '/',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarCreacionComentario,
  ],
  (req, res) => controller.crearComentario(req, res)
);

router.delete(
  '/:comentario_id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR]),
    ...validarComentarioIdParam,
  ],
  (req, res) => controller.eliminarComentario(req, res)
);

export default router;
