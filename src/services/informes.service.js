import fs from 'fs';
import path from 'path';
import { InformesModel } from '../models/informes.js';
import { ExcelBuilder } from '../utils/builders/excelBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export class InformesService {
  constructor() {
    this.model = new InformesModel();
  }

  generarInforme = async (fechaDesde = null, fechaHasta = null) => {
    try {
      if (fechaDesde && fechaHasta && new Date(fechaDesde) > new Date(fechaHasta)) {
        throw new ErrorResponse('La fecha inicial no puede ser posterior a la fecha final.', 400);
      }

      const resultados = await this.model.obtenerInformeGeneral(fechaDesde, fechaHasta);

      if (!resultados || resultados.length === 0) {
        console.warn('El procedimiento sp_informe_general no devolvió resultados.');
        return {};
      }

      return {
        reservasPorSalon: resultados[0],
        reservasPorCliente: resultados[1],
        resumenGeneral: resultados[2]?.[0] || {},
        usuariosPorRol: resultados[3],
        serviciosMasContratados: resultados[4],
        comentarios: resultados[5]?.[0] || {},
      };
    } catch (error) {
      console.error('Error al generar informe estadístico:', error.message);
      if (error instanceof ErrorResponse) throw error;
      throw new ErrorResponse('No se pudo generar el informe estadístico.', 500);
    }
  }

  exportarInformeExcel = async (fechaDesde = null, fechaHasta = null) => {
    try {
      const data = await this.generarInforme(fechaDesde, fechaHasta);

      if (!data || Object.keys(data).length === 0) {
        throw new ErrorResponse('No hay datos disponibles para exportar.', 404);
      }

      const buffer = await ExcelBuilder.generarReporteInformes(data, fechaDesde, fechaHasta);

      const outputDir = path.join(process.cwd(), 'reports');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Carpeta creada: ${outputDir}`);
      }

      const rango = fechaDesde && fechaHasta ? `${fechaDesde}_a_${fechaHasta}` : 'completo';
      const filePath = path.join(outputDir, `informe_estadistico_${rango}_${Date.now()}.xlsx`);
      await fs.promises.writeFile(filePath, buffer);

      console.log(`Informe Excel exportado correctamente en: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('Error al exportar informe Excel:', error.message);
      if (error instanceof ErrorResponse) throw error;
      throw new ErrorResponse('No se pudo exportar el informe estadístico en Excel.', 500);
    }
  }
}
