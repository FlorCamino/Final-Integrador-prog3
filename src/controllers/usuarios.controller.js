import UsuariosService from '../services/usuarios.service.js';

export default class UsuariosController {
  constructor() {
    this.usuariosService = new UsuariosService();
  }

  obtenerUsuarios = async (req, res) => {
    try {
      const { limit, offset, estado, sort, order } = req.query;
      const { data } = await this.usuariosService.buscarTodos({ limit, offset, estado, sort, order });
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  obtenerUsuarioPorId = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID no válido.' });

      const usuario = await this.usuariosService.buscarPorId(id);
      if (!usuario)
        return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });

      res.status(200).json({ success: true, data: usuario });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  modificarUsuario = async (req, res) => {
    try {
      const { id } = req.params;

      const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, activo } = req.body;

      const datosActualizar = {
        ...(nombre !== undefined && { nombre }),
        ...(apellido !== undefined && { apellido }),
        ...(nombre_usuario !== undefined && { nombre_usuario }),
        ...(contrasenia !== undefined && { password: contrasenia }),
        ...(tipo_usuario !== undefined && { tipo_usuario }),
        ...(activo !== undefined && { activo }),
      };

      const resultado = await this.usuariosService.actualizarUsuario(id, datosActualizar);

      if (resultado.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Usuario no encontrado.' });
      }

      res.status(200).json({ success: true, message: 'Usuario modificado correctamente.' });
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Nombre de usuario ya existe.' });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  };

  crearUsuario = async (req, res) => {
    try {

      const { nombre, apellido, nombre_usuario, contrasenia, tipo_usuario } = req.body;

      if (!nombre || !apellido || !nombre_usuario || !contrasenia || !tipo_usuario) {
        return res
          .status(400)
          .json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const nuevoUsuario = await this.usuariosService.agregarUsuario({
        nombre,
        apellido,
        nombre_usuario,
        password: contrasenia,
        tipo_usuario,
      });

      res.status(201).json({ success: true, data: nuevoUsuario });
    } catch (err) {
      if (err.code === 'USER_EXISTS') {
        return res.status(409).json({ success: false, message: 'Nombre de usuario ya existe.' });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  };

  eliminarUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await this.usuariosService.borrarUsuario(id);

      if (resultado.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Usuario no encontrado.' });
      }

      res.status(200).json({ success: true, message: 'Usuario eliminado correctamente.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
