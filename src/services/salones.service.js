import Salones from '../models/salones.js';

export default class SalonesService {
  constructor() {
    this.salonModel = new Salones();
  }

  buscarTodos = async ({ limit, offset, estado, sort, order }) => {
    limit = limit !== undefined ? parseInt(limit, 10) : undefined;
    offset = offset !== undefined ? parseInt(offset, 10) : undefined;

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) limit = undefined;
    if (offset !== undefined && (isNaN(offset) || offset < 0)) offset = 0;

    const { rows } = await this.salonModel.buscarTodosSalones({ limit, offset, estado, sort, order });
    return { data: rows };
  };


  buscarPorId = async (id) => {
    const salon = await this.salonModel.buscarSalonPorId(id);
    return salon;
  };

  actualizarSalon = async (salon_id, datos) => {
    const resultado = await this.salonModel.modificarSalonPorId(salon_id, datos);
    return resultado;
  };

  agregarSalon = async (datos) => {
    const nuevoSalon = await this.salonModel.crearSalon(datos);
    return nuevoSalon;
  };

  borrarSalon = async (salon_id) => {
    const resultado = await this.salonModel.eliminarSalonPorId(salon_id);
    return resultado;
  };
}
