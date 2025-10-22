import express from "express";
import ComentariosController from "../../controllers/Comentarios.controller.js";
import { validarCreacionComentario, validarReservaIdParam } from "../../middlewares/comentarios.validator.js";
import { verificarToken } from '../../middlewares/auth.js';
import { verificarRol } from '../../middlewares/role.js';
import { attachUsuarioId } from '../../middlewares/attachUsuarioId.js';

const router = express.Router();
const controller = new ComentariosController();

router.get("/:reserva_id", validarReservaIdParam, (req, res) => controller.obtenerPorReserva(req, res));

router.post(
  "/",
  verificarToken,
  verificarRol('administrador', 'empleado'),
  attachUsuarioId,
  validarCreacionComentario,
  (req, res) => controller.crear(req, res)
);

router.delete("/:comentario_id", (req, res) => controller.eliminar(req, res));

export default router;
