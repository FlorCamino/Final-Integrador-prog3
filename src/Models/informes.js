import { obtenerPool } from '../config/db.js';

export class InformesModel {
   obtenerInformeGeneral = async (fechaDesde = null, fechaHasta = null) => {
    try {
      const pool = await obtenerPool();
      const [resultSets] = await pool.query('CALL sp_informe_general(?, ?)', [fechaDesde, fechaHasta]);

      return resultSets;
    } catch (error) {
      console.error('Error en InformesModel.obtenerInformeGeneral:', error.message);
      throw new Error('Error al ejecutar el procedimiento almacenado de informes.');
    }
  }
}