import Servicios from '../Models/servicios.js';

export default class ServiciosService {
  constructor() {
    this.servicioModel = new Servicios();
  }

  buscarTodos = async ({ limit = 10, offset = 0, estado, sort, order }) => {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const { rows } = await this.servicioModel.buscarTodosServicios({ limit, offset, estado, sort, order });
    return { data: rows };
  }

  buscarPorId = async (id) => {
    const servicio = await this.servicioModel.buscarServicioPorId(id);
    return servicio;
  }

  actualizarServicio = async (servicio_id, datos) => {
    const resultado = await this.servicioModel.modificarServicioPorId(servicio_id, datos);
    return resultado;
  }

  agregarServicio = async (datos) => {
    const nuevoServicio = await this.servicioModel.crearServicio(datos);
    return nuevoServicio;
  }

  borrarServicios = async (servicio_id) => {
    const resultado = await this.servicioModel.eliminarServicioPorId(servicio_id);
    return resultado;
  }
}


