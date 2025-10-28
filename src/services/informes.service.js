import { ejecutarConsulta } from '../config/db.js';

export const generarInforme = async () => {
  try {
    const [resultados] = await ejecutarConsulta('CALL sp_informe_general()');

    return {
      reservasPorSalon: resultados[0],
      reservasPorUsuario: resultados[1],
      resumenReservas: resultados[2][0],
      usuariosPorTipo: resultados[3],
      salones: resultados[4],
      comentariosPorReserva: resultados[5],
    };
  } catch (error) {
    console.error('Error al generar informe:', error.message);
    throw new Error('No se pudo generar el informe');
  }
};
