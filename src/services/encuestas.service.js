import EncuestasModel from '../models/encuestas.js';
import ReservasModel from '../models/reservas.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import { ROLES } from '../constants/roles.js';

export default class EncuestasService {
  constructor() {
    this.model = new EncuestasModel();
    this.reservasModel = new ReservasModel();
  }

  async crearEncuesta(data, usuario) {
    const { reserva_id, puntuacion, comentario } = data;

    if (!usuario || !usuario.tipo_usuario) {
      throw new ErrorResponse('Debe iniciar sesión para registrar una encuesta.', 401);
    }

    const reserva = await this.reservasModel.buscarReservaPorId(reserva_id);
    if (!reserva) {
      throw new ErrorResponse('La reserva indicada no existe o está inactiva.', 404);
    }

    if (usuario.tipo_usuario === ROLES.CLIENTE && reserva.usuario_id !== usuario.usuario_id) {
      throw new ErrorResponse('No puede registrar una encuesta para una reserva que no le pertenece.', 403);
    }

    const fechaReserva = new Date(reserva.fecha_reserva);
    if (fechaReserva > new Date()) {
      throw new ErrorResponse('La encuesta solo puede completarse después del evento.', 400);
    }

    const existente = await this.model.obtenerPorReserva(reserva_id);
    if (existente) {
      throw new ErrorResponse('Ya existe una encuesta para esta reserva.', 409);
    }

    const id = await this.model.crearEncuesta({
      reserva_id,
      usuario_id: usuario.usuario_id,
      puntuacion,
      comentario,
    });

    return { id, mensaje: 'Encuesta registrada con éxito.' };
  }

  async listarEncuestas(usuario) {
    if (!usuario || !usuario.tipo_usuario) {
      throw new ErrorResponse('Debe iniciar sesión para acceder a las encuestas.', 401);
    }

    if ([ROLES.ADMINISTRADOR, ROLES.EMPLEADO].includes(usuario.tipo_usuario)) {
      return await this.model.obtenerEncuestas();
    }

    if (usuario.tipo_usuario === ROLES.CLIENTE) {
      return await this.model.obtenerEncuestasPorUsuario(usuario.usuario_id);
    }

    throw new ErrorResponse('Rol no autorizado para listar encuestas.', 403);
  }

  async obtenerPorReserva(reserva_id, usuario) {
    if (!usuario || !usuario.tipo_usuario) {
      throw new ErrorResponse('Debe iniciar sesión para acceder a esta información.', 401);
    }

    const encuesta = await this.model.obtenerPorReserva(reserva_id);
    if (!encuesta) {
      throw new ErrorResponse('No se encontró encuesta para esta reserva.', 404);
    }

    if (usuario.tipo_usuario === ROLES.CLIENTE) {
      const reserva = await this.reservasModel.buscarReservaPorId(reserva_id);
      if (!reserva || reserva.usuario_id !== usuario.usuario_id) {
        throw new ErrorResponse('No tiene permiso para ver esta encuesta.', 403);
      }
    }

    return encuesta;
  }

  async eliminarEncuesta(encuesta_id, usuario) {
    if (!usuario || !usuario.tipo_usuario) {
      throw new ErrorResponse('Debe iniciar sesión para eliminar encuestas.', 401);
    }

    const encuesta = await this.model.obtenerPorId(encuesta_id);
    if (!encuesta) {
      throw new ErrorResponse('No se encontró la encuesta indicada.', 404);
    }

    if (
      usuario.tipo_usuario !== ROLES.ADMINISTRADOR &&
      usuario.usuario_id !== encuesta.usuario_id
    ) {
      throw new ErrorResponse('No tiene permisos para eliminar esta encuesta.', 403);
    }

    const eliminada = await this.model.eliminarEncuesta(encuesta_id);
    if (!eliminada) {
      throw new ErrorResponse('No fue posible eliminar la encuesta.', 500);
    }

    return { mensaje: 'Encuesta eliminada correctamente.' };
  }
}
