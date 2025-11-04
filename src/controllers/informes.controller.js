import { InformesService } from '../services/informes.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class InformesController {
  constructor() {
    this.informesService = new InformesService();
  }

  obtenerEstadisticas = async (req, res) => {
    try {
      if (req.user?.tipo_usuario !== 1) {
        throw new ErrorResponse('Acceso denegado. Solo el administrador puede generar informes.', 403);
      }

      const { desde, hasta } = req.query;

      if ((desde && isNaN(Date.parse(desde))) || (hasta && isNaN(Date.parse(hasta)))) {
        throw new ErrorResponse('Las fechas deben tener formato válido (YYYY-MM-DD).', 400);
      }

      const data = await this.informesService.generarInforme(desde || null, hasta || null);

      const rangoTexto =
        desde && hasta
          ? `entre ${desde} y ${hasta}`
          : 'para todo el período disponible';

      return ResponseBuilder.success(
        res,
        data,
        `Informe estadístico generado correctamente ${rangoTexto}.`
      );
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };

  exportarInformeExcel = async (req, res) => {
    try {
      if (req.user?.tipo_usuario !== 1) {
        throw new ErrorResponse('Acceso denegado. Solo el administrador puede exportar informes.', 403);
      }

      const { desde, hasta } = req.query;

      if ((desde && isNaN(Date.parse(desde))) || (hasta && isNaN(Date.parse(hasta)))) {
        throw new ErrorResponse('Las fechas deben tener formato válido (YYYY-MM-DD).', 400);
      }

      const filePath = await this.informesService.exportarInformeExcel(desde || null, hasta || null);

      res.download(filePath, (err) => {
        if (err) {
          console.error('Error al enviar el archivo:', err);
          return ResponseBuilder.handleError(
            res,
            new ErrorResponse('Error al descargar el archivo.', 500)
          );
        }
      });
    } catch (error) {
      return ResponseBuilder.handleError(res, error);
    }
  };
}
