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
