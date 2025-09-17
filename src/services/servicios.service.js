import * as repositorio from '../repositories/servicios.repository.js';

export async function listarServicios({ limit = 10, offset = 0, estado, sort, order }) {
  limit  = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  if (isNaN(limit)  || limit <= 0) limit = 10;
  if (isNaN(offset) || offset < 0) offset = 0;

  const { rows } = await repositorio.obtenerTodosServicios({ limit, offset, estado, sort, order });
  return { data: rows };
}
