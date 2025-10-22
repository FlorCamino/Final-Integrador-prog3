import TurnosService from '../services/turnos.service.js';

export default class TurnosController {
  constructor() {
    this.turnosService = new TurnosService();
  }

  obtenerTurnos = async (req, res) => {
    try {
      const { limit, offset, estado, sort, order } = req.query;
      const { rows } = await this.turnosService.buscarTodos({ limit, offset, estado, sort, order });
      res.json({ success: true, data: rows });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  obtenerTurnoPorId = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID no válido.' });
      }

      const turno = await this.turnosService.buscarPorId(id);
      if (!turno) {
        return res.status(404).json({ success: false, message: 'Turno no encontrado.' });
      }

      res.status(200).json({ success: true, data: turno });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  crearTurno = async (req, res) => {
    try {
      const { orden, hora_desde, hora_hasta } = req.body;
      if (!orden || !hora_desde || !hora_hasta) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
      }

      const nuevoTurno = await this.turnosService.agregarTurno({ orden, hora_desde, hora_hasta });
      res.status(201).json({ success: true, data: nuevoTurno });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  modificarTurno = async (req, res) => {
    try {
  const turnoId = req.params.id || req.params.turno_id;
  const { orden, hora_desde, hora_hasta, activo } = req.body;

  const datosActualizar = {};
  if (orden !== undefined) datosActualizar.orden = orden;
  if (hora_desde !== undefined) datosActualizar.hora_desde = hora_desde;
  if (hora_hasta !== undefined) datosActualizar.hora_hasta = hora_hasta;
  if (activo !== undefined) datosActualizar.activo = activo;

  if (Object.keys(datosActualizar).length === 0) {
    return res.status(400).json({ success: false, message: 'No hay campos para actualizar.' });
  }

  const resultado = await this.turnosService.actualizarTurno(turnoId, datosActualizar);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Turno no encontrado.' });
      }

      res.json({ success: true, message: 'Turno modificado correctamente.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  eliminarTurno = async (req, res) => {
    try {
      const { turno_id } = req.params;
      const resultado = await this.turnosService.borrarTurno(turno_id);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Turno no encontrado.' });
      }

      res.json({ success: true, message: 'Turno eliminado correctamente.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}
