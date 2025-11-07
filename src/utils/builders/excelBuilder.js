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
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    worksheet.columns = headers.map(() => ({ width: 22 }));
    worksheet.getRow(1).eachCell((cell) => (cell.style = headerStyle));

    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    console.log('📊 Datos recibidos para generar el reporte:');
    reservas.forEach((r, i) => {
      console.log(`Reserva #${i + 1}:`, r);

      const row = worksheet.addRow([
        parseInt(r.reserva_id) || '',
        r.cliente ?? '',
        r.salon ?? '',
        r.tematica ?? '',
        r.fecha_reserva
          ? new Date(r.fecha_reserva).toLocaleDateString('es-AR', {
              timeZone: 'America/Argentina/Buenos_Aires',
            })
          : '',
        r.turno ?? '',
        r.descripcion_servicio ?? '',
        Number(r.importe_salon) || 0,
        Number(r.importe_servicios) || 0,
        Number(r.total_reserva) || 0,
      ]);

      row.eachCell((cell, colNumber) => {
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        if ([8, 9, 10].includes(colNumber)) cell.numFmt = '#,##0.00';
      });
    });

    worksheet.addRow([]);

    const ultimaFila = reservas.length + 2;
    const totalRow = worksheet.addRow([
      '', '', '', '', '', '', 'TOTAL GENERAL', '', '', { formula: `SUM(J2:J${ultimaFila - 1})` },
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
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D9D9D9' } };
    });

    worksheet.eachRow((row) => (row.height = 24));

    return await workbook.xlsx.writeBuffer();
  }

  static async generarReporteInformes(data) {
    const workbook = new ExcelJS.Workbook();

    const wsSalon = workbook.addWorksheet('Reservas por Salón');
    wsSalon.columns = [
      { header: 'Salón', key: 'salon', width: 30 },
      { header: 'Total Reservas', key: 'total_reservas', width: 20 },
      { header: 'Ingresos Totales (€)', key: 'ingresos_totales', width: 25 },
    ];
    wsSalon.addRows(data.reservasPorSalon || []);
    this._estilizarEncabezado(wsSalon);

    const wsCliente = workbook.addWorksheet('Reservas por Cliente');
    wsCliente.columns = [
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Total Reservas', key: 'total_reservas', width: 20 },
      { header: 'Total Pagado (€)', key: 'total_gastado', width: 25 },
    ];
    wsCliente.addRows(data.reservasPorCliente || []);
    this._estilizarEncabezado(wsCliente);

    const wsResumen = workbook.addWorksheet('Resumen General');
    wsResumen.addRows([
      ['Total de Reservas', data.resumenGeneral?.total_reservas || 0],
      ['Ingresos Totales (€)', data.resumenGeneral?.ingresos_totales || 0],
      ['Promedio por Reserva (€)', data.resumenGeneral?.promedio_por_reserva || 0],
    ]);
    wsResumen.columns = [{ width: 40 }, { width: 20 }];
    wsResumen.eachRow((row) => {
      row.font = { bold: true };
      row.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const wsUsuarios = workbook.addWorksheet('Usuarios por Rol');
    wsUsuarios.columns = [
      { header: 'Rol', key: 'rol', width: 25 },
      { header: 'Total Usuarios', key: 'total_usuarios', width: 20 },
    ];
    wsUsuarios.addRows(data.usuariosPorRol || []);
    this._estilizarEncabezado(wsUsuarios);

    const wsServicios = workbook.addWorksheet('Servicios Contratados');
    wsServicios.columns = [
      { header: 'Servicio', key: 'servicio', width: 30 },
      { header: 'Veces Contratado', key: 'veces_contratado', width: 25 },
      { header: 'Ingresos (€)', key: 'ingresos_por_servicio', width: 25 },
    ];
    wsServicios.addRows(data.serviciosMasContratados || []);
    this._estilizarEncabezado(wsServicios);

    workbook.eachSheet((sheet) => {
      sheet.eachRow((row) => (row.height = 22));
    });

    return await workbook.xlsx.writeBuffer();
  }

  static _estilizarEncabezado(worksheet) {
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '0070C0' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };

    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.getRow(1).eachCell((cell) => (cell.style = headerStyle));

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.border = borderStyle;
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
      }
    });
  }
}  