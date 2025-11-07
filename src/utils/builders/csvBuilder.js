export class CSVBuilder {
  static headers = [
    { key: 'reserva_id', label: 'ID Reserva' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'salon', label: 'Salón' },
    { key: 'tematica', label: 'Temática' },
    { key: 'fecha_reserva', label: 'Fecha' },
    { key: 'turno', label: 'Turno' },
    { key: 'descripcion_servicio', label: 'Descripción Servicio' },
    { key: 'importe_salon', label: 'Importe Salón' },
    { key: 'importe_servicios', label: 'Servicios' },
    { key: 'costo_total', label: 'Total' },
  ];

  static escape(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (/[",\n\r]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  static formatDate(value) {
    if (!value) return '';
    const d = new Date(value);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-ES');
  }

  static formatNumber(value) {
    const num = Number(value);
    if (isNaN(num)) return '';
    return num.toFixed(2);
  }

  static generarReporteReservas(reservas = []) {
    const headerRow = this.headers.map((h) => this.escape(h.label)).join(',');

    const dataRows = reservas.map((r) => {
      const row = [
        r.reserva_id != null ? parseInt(r.reserva_id) : '',
        r.cliente ?? '',
        r.salon ?? '',
        r.tematica ?? '',
        this.formatDate(r.fecha_reserva),
        r.turno ?? '',
        r.descripcion_servicio ?? '',
        this.formatNumber(r.importe_salon),
        this.formatNumber(r.importe_servicios),
        this.formatNumber(r.costo_total ?? r.total_reserva ?? r.importe_total ?? ''),
      ];

      return row.map((v) => this.escape(v)).join(',');
    });

    if (reservas.length > 0) {
      const totalGeneral = reservas.reduce(
        (acc, r) => acc + Number(r.costo_total ?? r.total_reserva ?? r.importe_total ?? 0),
        0
      );
      const totalRow = [
        '', // ID Reserva
        '', // Cliente
        '', // Salón
        '', // Temática
        '', // Fecha
        '', // Turno
        'TOTAL GENERAL', // Descripción Servicio (misma columna que Excel usa para el label)
        '', // Importe Salón
        '', // Servicios
        this.formatNumber(totalGeneral), // Total
      ];
      dataRows.push('');
      dataRows.push(totalRow.map((v) => this.escape(v)).join(','));
    }

    const csv = ['\ufeff' + headerRow, ...dataRows].join('\r\n');
    return csv;
  }
}

export default CSVBuilder;
