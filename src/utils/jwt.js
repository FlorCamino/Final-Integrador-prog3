import jwt from 'jsonwebtoken';

process.loadEnvFile();

export class JWTHelper {
  static generar(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
  }

  static verificar(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}
