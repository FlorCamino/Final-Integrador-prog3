import express from 'express';
import { 
  validarCreacionServicio,
  validarActualizacionServicio,
  validarServicioIdParam
} from '../../middlewares/validators/servicios.validator.js';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import { GetCache } from '../../middlewares/cache/GetCacheMiddleware.js';
import { ROLES } from '../../constants/roles.js';
import ServiciosController from '../../controllers/servicios.controller.js';

const router = express.Router();
const controller = new ServiciosController();

router.get('/',
  [ 
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
    GetCache('1 minutes')
  ],
  (req, res, next) => controller.obtenerServicios(req, res, next));

router.get(
  '/:id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO, ROLES.CLIENTE]),
    GetCache('1 minutes'),
    ...validarServicioIdParam,
  ],
  (req, res, next) => controller.obtenerServicioPorId(req, res, next)
);

router.post(
  '/',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarCreacionServicio,
  ],
  (req, res, next) => controller.crearServicio(req, res, next)
);

router.put(
  '/:servicio_id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarActualizacionServicio,
  ],
  (req, res, next) => controller.modificarServicio(req, res, next)
);

router.delete(
  '/:servicio_id',
  [
    RoleCheck.verificarRoles([ROLES.ADMINISTRADOR, ROLES.EMPLEADO]),
    ...validarServicioIdParam,
  ],
  (req, res, next) => controller.eliminarServicio(req, res, next)
);

export default router;
