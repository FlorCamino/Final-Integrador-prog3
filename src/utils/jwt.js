import jwt from 'jsonwebtoken';

process.loadEnvFile();

export class JWTHelper {

  static generar(payload) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está configurada.');
      }

      return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        algorithm: 'HS256',
      });
    } catch (error) {
      console.error('Error al generar token JWT:', error.message);
      throw error;
    }
  }

  static verificar(token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está configurada.');
      }

      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Error al verificar token JWT:', error.message);
      throw error;
    }
  }
}
