import { ejecutarConsulta } from '../config/db.js';

export class InformesModel {
  obtenerInformeGeneral = async (fechaDesde = null, fechaHasta = null) => {
    try {
      const [resultados] = await ejecutarConsulta(
        'CALL sp_informe_general(?, ?)',
        [fechaDesde, fechaHasta]
      );
      return resultados;
    } catch (error) {
      console.error('Error en InformesModel.obtenerInformeGeneral:', error.message);
      throw new Error('Error al ejecutar el procedimiento almacenado de informes.');
    }
  }
}