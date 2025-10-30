import PDFDocument from 'pdfkit';
import moment from 'moment';

export const PDFBuilder = {
  generarReporteReservas: async (reservas) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

    
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        
        doc.fontSize(18).text('Reporte de Reservas', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).text(`Generado: ${moment().format('DD/MM/YYYY HH:mm:ss')}`, {
          align: 'right',
        });
        doc.moveDown(1);

        
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('ID', 50, doc.y, { width: 50 })
          .text('Cliente', 100, doc.y, { width: 150 })
          .text('Fecha Reserva', 250, doc.y, { width: 120 })
          .text('Estado', 380, doc.y, { width: 100 })
          .text('Monto', 480, doc.y, { width: 80, align: 'right' });

        doc.moveDown(0.5);
        doc
          .strokeColor('#000000')
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke();

        doc.moveDown(0.5);

        
        doc.font('Helvetica').fontSize(10);

        reservas.forEach((r) => {
          doc
            .text(r.id || '-', 50, doc.y, { width: 50 })
            .text(r.cliente || '-', 100, doc.y, { width: 150 })
            .text(
              r.fecha_reserva
                ? moment(r.fecha_reserva).format('DD/MM/YYYY')
                : '-',
              250,
              doc.y,
              { width: 120 }
            )
            .text(r.estado || '-', 380, doc.y, { width: 100 })
            .text(r.monto ? `$${r.monto}` : '-', 480, doc.y, {
              width: 80,
              align: 'right',
            });

          doc.moveDown(0.3);

          // Salto de página si se llena
          if (doc.y > 700) {
            doc.addPage();
            doc.moveDown(1);
          }
        });

    
        doc.moveDown(2);
        doc
          .fontSize(9)
          .font('Helvetica-Oblique')
          .text('Documento generado automáticamente por el sistema de reservas.', {
            align: 'center',
          });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  },
};
