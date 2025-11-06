import express from 'express';
import { RoleCheck } from '../../middlewares/auth/RoleMiddleware.js';
import EncuestasController from '../../controllers/encuestas.controller.js';

const router = express.Router();
const controller = new EncuestasController();

router.post('/', RoleCheck.verificarRoles([1, 2, 3]), controller.crearEncuesta);
router.get('/', RoleCheck.verificarRoles([1, 2, 3]), controller.listarEncuestas);
router.get('/:reserva_id', RoleCheck.verificarRoles([1, 2, 3]), controller.obtenerPorReserva);

export default router;
