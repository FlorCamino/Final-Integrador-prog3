import Salones from '../Models/salones.js';

export default class SalonesService {
  constructor() {
    this.salonModel = new Salones();
  }

  buscarTodos = async ({ limit = 10, offset = 0, estado, sort, order }) => {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

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
