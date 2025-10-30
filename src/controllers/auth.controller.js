import AuthService from '../services/auth.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req, res) => {
    try {
      const { nombre_usuario, contrasenia } = req.body;

      if (!nombre_usuario?.trim() || !contrasenia?.trim()) {
        throw new ErrorResponse('Nombre de usuario y contraseña son requeridos', 400);
      }

      const resultado = await this.authService.login(nombre_usuario, contrasenia);

      return ResponseBuilder.success(res, resultado, 'Inicio de sesión exitoso');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  validarToken = async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader?.split(' ')[1];

      if (!token) throw new ErrorResponse('Token no proporcionado', 401);

      const decoded = await this.authService.validarToken(token);
      return ResponseBuilder.success(res, decoded, 'Token válido');
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
