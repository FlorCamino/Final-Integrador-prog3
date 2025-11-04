import { ExcelBuilder } from '../utils/builders/excelBuilder.js';
import { CSVBuilder } from '../utils/builders/csvBuilder.js';
import { PDFBuilder } from '../utils/builders/pdfBuilder.js';
import ReservasService from '../services/reservas.service.js';
import { ResponseBuilder } from '../utils/responseBuilder.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class ReportesController {
  constructor() {
    this.reservasService = new ReservasService();
  }

  generarExcel = async (req, res) => {
    try {
      const { desde, hasta } = req.query;

      if (!desde || !hasta) {
        throw new ErrorResponse('Debe proporcionar un rango de fechas válido (desde y hasta)', 400);
      }

      const data = await this.reservasService.generarReporte(desde, hasta);

      if (!data || data.length === 0) {
        throw new ErrorResponse('No se encontraron reservas en el rango seleccionado', 404);
      }

      const buffer = await ExcelBuilder.generarReporteReservas(data);
      const nombreArchivo = `reporte_reservas_${Date.now()}.xlsx`;

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.send(buffer);
    } catch (error) {
      console.error('Error al generar reporte Excel:', error);
      return ResponseBuilder.handleError(res, error);
    }
  };

  generarCSV = async (req, res) => {
    try {
      const { desde, hasta } = req.query;

      if (!desde || !hasta) {
        throw new ErrorResponse('Debe proporcionar un rango de fechas válido (desde y hasta)', 400);
      }

      const data = await this.reservasService.generarReporte(desde, hasta);

      if (!data || data.length === 0) {
        throw new ErrorResponse('No se encontraron reservas en el rango seleccionado', 404);
      }

      const csv = CSVBuilder.generarReporteReservas(data);
      const nombreArchivo = `reporte_reservas_${Date.now()}.csv`;

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.status(200).send(csv);
    } catch (error) {
      console.error('Error al generar reporte CSV:', error);
      return ResponseBuilder.handleError(res, error);
    }
  };

  generarPDF = async (req, res) => {
    try {
      const { desde, hasta } = req.query;

      if (!desde || !hasta) {
        throw new ErrorResponse('Debe proporcionar un rango de fechas válido (desde y hasta)', 400);
      }

      const data = await this.reservasService.generarReporte(desde, hasta);

      if (!data || data.length === 0) {
        throw new ErrorResponse('No se encontraron reservas en el rango seleccionado', 404);
      }

      const pdfBuffer = await PDFBuilder.generarReporteReservas(data);
      const nombreArchivo = `reporte_reservas_${Date.now()}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.status(200).send(pdfBuffer);
    } catch (error) {
      console.error('Error al generar reporte PDF:', error);
      return ResponseBuilder.handleError(res, error);
    }
  };

  generarPDFIndividual = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ErrorResponse('Debe proporcionar un ID de reserva válido', 400);
      }

      const reserva = await this.reservasService.obtenerReservaDetalladaPorId(id);

      if (!reserva) {
        throw new ErrorResponse('Reserva no encontrada', 404);
      }

      const pdfBuffer = await PDFBuilder.generarComprobanteReserva(reserva);
      const nombreArchivo = `comprobante_reserva_${id}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
      res.status(200).send(pdfBuffer);
    } catch (error) {
      console.error('Error al generar comprobante PDF:', error);
      return ResponseBuilder.handleError(res, error);
    }
  };
}
