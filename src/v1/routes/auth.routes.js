import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../../controllers/auth.controller.js';
import { validarCampos } from '../../middlewares/validar.campos.js';

const router = express.Router();

router.post(
  '/login',
  [
    body('nombre_usuario')
      .notEmpty()
      .withMessage('El nombre de usuario es obligatorio'),
    body('contrasenia').notEmpty().withMessage('La contraseña es obligatoria'),
    validarCampos,
  ],
  AuthController.login
);

export default router;
