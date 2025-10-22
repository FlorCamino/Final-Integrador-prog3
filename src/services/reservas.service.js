import Reservas from '../models/reservas.js';

export default class ReservasService {
  constructor() {
    this.model = new Reservas();
  }

  generarReporte = async (desde, hasta) => {
    return await this.model.obtenerReportePorRango(desde, hasta);
  }
}
