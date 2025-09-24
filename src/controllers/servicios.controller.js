import * as servicio from '../services/servicios.service.js';

export async function obtenerServicios(req, res) {
  try {
    const { limit, offset, estado, sort, order } = req.query;
    const { data } = await servicio.listarServicios({ limit, offset, estado, sort, order });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function eliminarServicios(req, res) {
  try {
    const { servicio_id } = req.params;
    const resultado = await servicio.borrarServicios(servicio_id);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }
    res.json({ success: true, message: 'Servicio eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
