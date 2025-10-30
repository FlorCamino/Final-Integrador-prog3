import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import UsuariosService from '../services/usuarios.service.js';

process.loadEnvFile();

const usuariosService = new UsuariosService();

export const estrategia = new LocalStrategy(
  {
    usernameField: 'nombre_usuario',
    passwordField: 'contrasenia',
    session: false,
  },
  async (nombre_usuario, contrasenia, done) => {
    try {
      if (!nombre_usuario?.trim() || !contrasenia?.trim()) {
        return done(null, false, {
          message: 'Debe ingresar nombre de usuario y contraseña.',
        });
      }

      const usuario = await usuariosService.buscarPorNombreUsuario(nombre_usuario);
      if (!usuario) {
        return done(null, false, { message: 'Usuario no encontrado.' });
      }

      if (!usuario.contrasenia) {
        return done(null, false, { message: 'El usuario no tiene contraseña registrada.' });
      }

      const esValido = await bcrypt.compare(contrasenia, usuario.contrasenia);
      if (!esValido) {
        return done(null, false, { message: 'Contraseña incorrecta.' });
      }

      delete usuario.contrasenia;

      return done(null, usuario);
    } catch (error) {
      console.error('❌ Error en estrategia Local:', error.message);
      return done(error);
    }
  }
);

export const validacion = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      const usuario = await usuariosService.buscarPorId(payload.usuario_id);
      if (!usuario || usuario.activo === 0) {
        return done(null, false, { message: 'Usuario no válido o inactivo.' });
      }

      delete usuario.contrasenia;
      return done(null, usuario);
    } catch (error) {
      console.error('Error en estrategia JWT:', error.message);
      return done(error, false);
    }
  }
);
