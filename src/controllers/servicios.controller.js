import * as servicio from '../services/servicios.service.js';
import * as serviciosService from '../services/servicios.service.js';
export async function obtenerServicios(req, res) {
  try {
    const { limit, offset, estado, sort, order } = req.query;
    const { data } = await servicio.listarServicios({ limit, offset, estado, sort, order });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
export async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'ID  no  válido.' });
    }

    const servicio = await serviciosService.getServicioById(id);

    res.status(200).json({ success: true, data: servicio });
  } catch (error) {
    next(error); 
  }
}
