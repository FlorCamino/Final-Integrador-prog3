import Turnos from '../models/turnos.js';

export default class TurnosService {
  constructor() {
    this.turnosModel = new Turnos();
  }

  buscarTodos = async ({ limit = 10, offset = 0, estado, sort, order }) => {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const { rows } = await this.turnosModel.buscarTodosTurnos({ limit, offset, estado, sort, order });
    return { data: rows };
  }

  buscarPorId = async (id) => {
    const turno = await this.turnosModel.buscarTurnoPorId(id);
    return turno;
  }

  actualizarTurno = async (turno_id, datos) => {
    const resultado = await this.turnosModel.modificarTurnoPorId(turno_id, datos);
    return resultado;
  }

  agregarTurno = async (datos) => {
    const nuevoTurno = await this.turnosModel.crearTurno(datos);
    return nuevoTurno;
  }

  borrarTurno = async (turno_id) => {
    const resultado = await this.turnosModel.eliminarTurnoPorId(turno_id);
    return resultado;
  }
}
