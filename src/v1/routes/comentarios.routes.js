import express from "express";
import { check } from "express-validator";
// import { validarCampos } from "../../middlewares/validate.js";
import ComentariosController from "../../controllers/Comentarios.controller.js";

const router = express.Router();
const controller = new ComentariosController();

router.get("/:reserva_id", (req, res) => controller.obtenerPorReserva(req, res));

router.post(
  "/",
  [
    check("reserva_id", "El ID de reserva es obligatorio").notEmpty(),
    check("usuario_id", "El ID de usuario es obligatorio").notEmpty(),
    check("comentario", "El comentario no puede estar vacío").notEmpty(),
    // validarCampos, 
  ],
  (req, res) => controller.crear(req, res)
);

router.delete("/:comentario_id", (req, res) => controller.eliminar(req, res));

export default router;
