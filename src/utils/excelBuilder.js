import ExcelJS from 'exceljs';

export class ExcelBuilder {
  static async generarReporteReservas(reservas) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Reservas');

    const headers = [
      'ID Reserva',
      'Cliente',
      'Salón',
      'Temática',
      'Fecha',
      'Turno',
      'Descripción Servicio',
      'Importe Salón',
      'Servicios',
      'Total'
    ];

    worksheet.addRow(headers);

    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '0070C0' } },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
      alignment: { horizontal: 'center', vertical: 'middle' },
    };

    worksheet.columns = headers.map(() => ({ width: 20 }));

    worksheet.getRow(1).eachCell((cell) => (cell.style = headerStyle));

    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    reservas.forEach((r) => {
      const row = worksheet.addRow([
        parseInt(r.reserva_id) || '',
        r.cliente ?? '',
        r.salon ?? '',
        r.tematica ?? '',
        r.fecha_reserva ? new Date(r.fecha_reserva).toLocaleDateString('es-ES') : '',
        r.turno ?? '',
        r.descripcion_servicio ?? '',
        Number(r.importe_salon) || 0,
        Number(r.importe_servicios) || 0,
        Number(r.costo_total) || 0,
      ]);

      row.eachCell((cell, colNumber) => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        if ([8, 9, 10].includes(colNumber)) {
          cell.numFmt = '#,##0.00'; 
        }
      });
    });

    worksheet.addRow([]);

    const ultimaFila = reservas.length + 1;

    const totalRow = worksheet.addRow([
      '', '', '', '', '', '', 'TOTAL GENERAL', '', '', { formula: `SUM(J2:J${ultimaFila})` },
    ]);

    totalRow.eachCell((cell, colNumber) => {
      cell.border = borderStyle;
      if (colNumber === 7) {
        cell.font = { bold: true };
        cell.alignment = { horizontal: 'right' };
      }
      if (colNumber === 10) {
        cell.font = { bold: true };
        cell.numFmt = '#,##0.00';
      }
    });

    totalRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D9D9D9' },
      };
    });

    worksheet.getColumn(1).numFmt = '0';
    worksheet.eachRow((row) => (row.height = 22));

    return await workbook.xlsx.writeBuffer();
  }
}
