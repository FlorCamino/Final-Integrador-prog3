import * as repositorio from '../repositories/servicios.repository.js';
import * as serviciosRepository from '../repositories/servicios.repository.js';
export async function listarServicios({ limit = 10, offset = 0, estado, sort, order }) {
  limit  = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  if (isNaN(limit)  || limit <= 0) limit = 10;
  if (isNaN(offset) || offset < 0) offset = 0;

  const { rows } = await repositorio.obtenerTodosServicios({ limit, offset, estado, sort, order });
  return { data: rows };
}
/**
 * Obtiene servicio ID y maneja el caso de no encontrar el servicio.
 * @param {number} id 
 * @returns {Promise<object>} 
 * @throws {Error} 
 */
export async function getServicioById(id) {
  const servicio = await serviciosRepository.findById(id);

  if (!servicio) {
    const error = new Error('El servicio no fue encontrado.');
    error.status = 404;
    throw error;
  }

  return servicio;
}

export async function agregarServicio(datos) {
  if (!datos.descripcion || typeof datos.descripcion !== 'string') {
    throw new Error('La descripción es obligatoria y debe ser texto.');
  }
  if (isNaN(datos.importe) || datos.importe <= 0) {
    throw new Error('El importe debe ser un número mayor a 0.');
  }
  return await repositorio.crearServicio(datos);
}

export async function borrarServicios(servicio_id) {
  const resultado = await repositorio.eliminarServicioPorId(servicio_id);
  return resultado;
}

