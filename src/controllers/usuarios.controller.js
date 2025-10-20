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
      const { nombre, apellido, nombre_usuario, password, tipo_usuario, activo } = req.body;

      if (!nombre || !apellido || !nombre_usuario || !tipo_usuario) {
        return res
          .status(400)
          .json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const resultado = await this.usuariosService.actualizarUsuario(id, {
        nombre,
        apellido,
        nombre_usuario,
        password,
        tipo_usuario,
        activo,
      });

      if (resultado.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Usuario no encontrado.' });
      }

      res.status(200).json({ success: true, message: 'Usuario modificado correctamente.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  crearUsuario = async (req, res) => {
    try {
      const { nombre, apellido, nombre_usuario, password, tipo_usuario } = req.body;

      if (!nombre || !apellido || !nombre_usuario || !password || !tipo_usuario) {
        return res
          .status(400)
          .json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const nuevoUsuario = await this.usuariosService.agregarUsuario({
        nombre,
        apellido,
        nombre_usuario,
        password,
        tipo_usuario,
      });

      res.status(201).json({ success: true, data: nuevoUsuario });
    } catch (err) {
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
