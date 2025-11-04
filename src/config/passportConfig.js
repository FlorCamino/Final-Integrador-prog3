import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import UsuariosService from '../services/usuarios.service.js';

process.loadEnvFile();

export default class PassportConfig {
  constructor(passport) {
    this.passport = passport;
    this.usuariosService = new UsuariosService();
  }

  initialize() {
    this._configurarLocalStrategy();
    this._configurarJwtStrategy();
  }

  _configurarLocalStrategy() {
    this.passport.use(
      new LocalStrategy(
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

            const usuario = await this.usuariosService.buscarPorNombreUsuario(nombre_usuario);

            if (!usuario) {
              return done(null, false, { message: 'Usuario no encontrado.' });
            }

            if (!usuario.contrasenia) {
              return done(null, false, {
                message: 'El usuario no tiene contraseña registrada.',
              });
            }

            const esValido = await bcrypt.compare(contrasenia, usuario.contrasenia);
            if (!esValido) {
              return done(null, false, { message: 'Contraseña incorrecta.' });
            }

            const usuarioPlano =
              typeof usuario.get === 'function' ? usuario.get({ plain: true }) : usuario;

            delete usuarioPlano.contrasenia;
            return done(null, usuarioPlano);
          } catch (error) {
            console.error('Error en estrategia Local:', error);
            return done(error, false);
          }
        }
      )
    );
  }

  _configurarJwtStrategy() {
    this.passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET,
        },
        async (payload, done) => {
          try {
            const id = payload.usuario_id || payload.id || payload.sub;
            if (!id) {
              return done(null, false, { message: 'Token sin identificador de usuario.' });
            }

            const usuario = await this.usuariosService.buscarPorId(id);

            if (!usuario || usuario.activo === 0) {
              return done(null, false, { message: 'Usuario no válido o inactivo.' });
            }

            const usuarioPlano =
              typeof usuario.get === 'function' ? usuario.get({ plain: true }) : usuario;

            delete usuarioPlano.contrasenia;
            return done(null, usuarioPlano);
          } catch (error) {
            console.error('Error en estrategia JWT:', error);
            return done(null, false, { message: 'Token inválido o expirado.' });
          }
        }
      )
    );
  }
}
