
import serviciosService from '../services/servicios.service.js';

export default class ServiciosController {
  constructor() {
    this.serviciosService = new serviciosService();
  }

  obtenerServicios = async (req, res) => {
    try {
      const { limit, offset, estado, sort, order } = req.query;
      const { data } = await this.serviciosService.buscarTodos({ limit, offset, estado, sort, order });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  obtenerServicioPorId = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID no válido.' });
      }
      const servicio = await this.serviciosService.buscarPorId(id);
      if (!servicio) {
        return res.status(404).json({ success: false, message: 'Servicio no encontrado.' });
      }
      res.status(200).json({ success: true, data: servicio });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  modificarServicio = async (req, res) => {
    try {
      const { servicio_id } = req.params;
      const { descripcion, importe, activo } = req.body;
      const datosActualizar = {
        ...(descripcion !== undefined && { descripcion }),
        ...(importe !== undefined && { importe }),
        ...(activo !== undefined && { activo }),
      };

      if (Object.keys(datosActualizar).length === 0) {
        return res.status(400).json({ success: false, message: 'No hay campos para actualizar.' });
      }

      const resultado = await this.serviciosService.actualizarServicio(servicio_id, datosActualizar);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Servicio no encontrado' })
      }
      res.json({ success: true, message: 'Servicio modificado correctamente' })
    }
    catch (err) {
      res.status(500).json({ success: false, message: err.message })
    }
  }

  crearServicio = async (req, res) => {
    try {
      const { descripcion, importe } = req.body;
      const nuevoServicio = await this.serviciosService.agregarServicio({ descripcion, importe });
      res.status(201).json({ success: true, data: nuevoServicio });
    }
    catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };


  eliminarServicio = async (req, res) => {
    try {
      const { servicio_id } = req.params;
      const resultado = await this.serviciosService.borrarServicios(servicio_id);
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
      }
      res.json({ success: true, message: 'Servicio eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}