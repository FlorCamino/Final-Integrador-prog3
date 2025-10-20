import bcrypt from 'bcryptjs';
import conexion from '../config/db.js';
import { generateToken } from '../utils/jwt.js';
import { roles } from '../config/roles.js';

export class AuthController {
  static async login(req, res) {
    const { nombre_usuario, contrasenia } = req.body;

    try {
      const conn = await conexion();

      const [rows] = await conn.query(
        'SELECT * FROM usuarios WHERE nombre_usuario = ? AND activo = 1',
        [nombre_usuario]
      );

      if (rows.length === 0)
        return res.status(401).json({ mensaje: 'Usuario no encontrado' });

      const usuario = rows[0];
      const passwordOk = await bcrypt.compare(contrasenia, usuario.contrasenia);
      
      if (!passwordOk)
        return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

      const rol = roles[usuario.tipo_usuario] || 'desconocido';
      const token = generateToken({
        id: usuario.usuario_id,
        nombre_usuario: usuario.nombre_usuario,
        rol,
      });

      return res.json({
        mensaje: 'Inicio de sesión exitoso',
        token,
        usuario: {
          id: usuario.usuario_id,
          nombre: usuario.nombre,
          rol,
        },
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ error: 'Error interno', detalle: error.message });
    }
  }
}
