import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../../controllers/auth.controller.js';
import { FieldsValidator } from '../../middlewares/validators/FieldsValidator.js';

const router = express.Router();
const controller = new AuthController();

router.post(
  '/login',
  [
    body('nombre_usuario')
      .notEmpty()
      .withMessage('El nombre de usuario es obligatorio'),
    body('contrasenia')
      .notEmpty()
      .withMessage('La contraseña es obligatoria'),
    FieldsValidator.validate,
  ],
  (req, res) => controller.login(req, res)
);

router.get('/validar', (req, res) => controller.validarToken(req, res));

export default router;
