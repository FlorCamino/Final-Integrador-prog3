import SalonesService from '../services/salones.service.js';

export default class SalonesController {
  constructor() {
    this.salonesService = new SalonesService();
  }

  obtenerSalones = async (req, res) => {
    try {
      const { limit, offset, estado, sort, order } = req.query;
      const { data } = await this.salonesService.buscarTodos({ limit, offset, estado, sort, order });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  obtenerSalonPorId = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ success: false, message: 'ID no válido.' });

      const salon = await this.salonesService.buscarPorId(id);
      if (!salon) return res.status(404).json({ success: false, message: 'Salón no encontrado.' });

      res.status(200).json({ success: true, data: salon });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  modificarSalon = async (req, res) => {
    try {
      const { salon_id } = req.params;
      const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;

      if (!titulo || !direccion || !importe) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const resultado = await this.salonesService.actualizarSalon(salon_id, {
        titulo,
        direccion,
        latitud,
        longitud,
        capacidad,
        importe,
      });

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Salón no encontrado.' });
      }

      res.json({ success: true, message: 'Salón modificado correctamente.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  crearSalon = async (req, res) => {
    try {
      const { titulo, direccion, latitud, longitud, capacidad, importe } = req.body;
      if (!titulo || !direccion || !importe) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const nuevoSalon = await this.salonesService.agregarSalon({
        titulo,
        direccion,
        latitud,
        longitud,
        capacidad,
        importe,
      });

      res.status(201).json({ success: true, data: nuevoSalon });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  eliminarSalon = async (req, res) => {
    try {
      const { salon_id } = req.params;
      const resultado = await this.salonesService.borrarSalon(salon_id);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Salón no encontrado.' });
      }

      res.json({ success: true, message: 'Salón eliminado correctamente.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
