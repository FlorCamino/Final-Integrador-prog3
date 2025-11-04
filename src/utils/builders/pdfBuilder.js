import PDFDocument from "pdfkit";
import moment from "moment";

export const PDFBuilder = {
  // ============================================================
  //  REPORTE GENERAL DE RESERVAS (varias filas, landscape)
  // ============================================================
  generarReporteReservas: async (reservas, rango = {}) => {
    const { desde, hasta } = rango;

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 40, layout: "landscape" });
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        const azul = "#004a7c";
        const grisFondo = "#f2f4f7";

        doc.rect(0, 0, doc.page.width, 70).fill(azul);
        doc.fillColor("#fff")
          .font("Helvetica-Bold")
          .fontSize(18)
          .text("Facultad de Ciencias de la Administración – UNER", 50, 25);
        doc.fontSize(13).text("Reporte General de Reservas", 50, 48);
        doc.fontSize(9).text(`Generado: ${moment().format("DD/MM/YYYY HH:mm")}`, 50, 52, {
          align: "right",
          width: doc.page.width - 100,
        });

        doc.moveDown(3);
        doc.fillColor("#000")
          .font("Helvetica-Bold")
          .fontSize(14)
          .text("Listado de Reservas", { align: "center" });

        if (desde && hasta) {
          doc.font("Helvetica-Oblique")
            .fontSize(10)
            .fillColor("#555")
            .text(
              `Periodo: ${moment(desde).format("DD/MM/YYYY")} a ${moment(hasta).format("DD/MM/YYYY")}`,
              { align: "center" }
            );
        }

        doc.moveDown(1);

        const startX = 50;
        const endX = doc.page.width - 50;

        const colWidths = [25, 65, 90, 80, 80, 80, 130, 70, 70];

        const headers = [
          "#",
          "Fecha",
          "Turno",
          "Cliente",
          "Salón",
          "Temática",
          "Servicios",
          "Monto Salón",
          "Total",
        ];

        const drawTableHeader = (yPos) => {
          doc.rect(startX, yPos, endX - startX, 20).fill(grisFondo);
          doc.fillColor("#000").font("Helvetica-Bold").fontSize(10);
          let x = startX + 5;
          headers.forEach((h, i) => {
            doc.text(h, x, yPos + 5, {
              width: colWidths[i],
              align: i >= 7 ? "right" : "center",
            });
            x += colWidths[i];
          });
          doc.moveTo(startX, yPos + 20)
            .lineTo(endX, yPos + 20)
            .strokeColor("#ccc")
            .stroke();
        };

        let y = doc.y + 10;
        drawTableHeader(y);
        y += 25;

        doc.font("Helvetica").fontSize(9).fillColor("#000");

        reservas.forEach((r, idx) => {
          const cliente = r.cliente || "Sin cliente";
          const fecha = r.fecha_reserva ? moment(r.fecha_reserva).format("DD/MM/YYYY") : "-";
          const turno = r.turno || "-";
          const salon = r.salon || "Sin salón";
          const tematica = r.tematica || "-";
          const servicios = r.descripcion_servicio
            ? r.descripcion_servicio.split(",").map(s => `• ${s.trim()}`).join("\n")
            : "-";
          const montoSalon = r.importe_salon
            ? `$${Number(r.importe_salon).toLocaleString("es-AR")}`
            : "-";
          const totalReserva = r.costo_total
            ? `$${Number(r.costo_total).toLocaleString("es-AR")}`
            : "-";

          const valores = [
            r.reserva_id ?? "-",
            fecha,
            turno,
            cliente,
            salon,
            tematica,
            servicios,
            montoSalon,
            totalReserva,
          ];

          const serviciosAltura = doc.heightOfString(servicios, { width: colWidths[6] - 10 });
          const filaAltura = Math.max(20, serviciosAltura + 8);

          if (y + filaAltura > doc.page.height - 100) {
            doc.addPage({ layout: "landscape" });
            y = 100;
            drawTableHeader(y);
            y += 25;
            doc.font("Helvetica").fontSize(9).fillColor("#000");
          }

          if (idx % 2 === 0) {
            doc.save()
              .rect(startX, y, endX - startX, filaAltura)
              .fill("#fafafa")
              .restore();
          }

          let x = startX + 5;
          valores.forEach((val, i) => {
            doc.text(val, x, y + 3, {
              width: colWidths[i] - 10,
              align: i === 6 ? "left" : i >= 7 ? "right" : "left",
            });
            x += colWidths[i];
          });

          y += filaAltura + 2;
        });

        doc.moveTo(startX, doc.page.height - 50)
          .lineTo(endX, doc.page.height - 50)
          .strokeColor(azul)
          .stroke();

        doc.font("Helvetica-Oblique")
          .fontSize(9)
          .fillColor("#555")
          .text(
            "Documento generado automáticamente por el Sistema de Reservas – PROGIII",
            startX,
            doc.page.height - 40,
            { align: "center", width: endX - startX }
          );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  },

  // ============================================================
  //  COMPROBANTE INDIVIDUAL (tipo remito, portrait)
  // ============================================================
  generarComprobanteReserva: async (r) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, layout: "portrait" });
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        const azul = "#004a7c";
        const gris = "#333";
        const grisFondo = "#f3f4f6";

        doc.rect(0, 0, doc.page.width, 90).fill(azul);
        doc.fillColor("#fff").font("Helvetica-Bold").fontSize(20)
          .text("Facultad de Ciencias de la Administración – UNER", 50, 35);
        doc.fontSize(13).text("Comprobante de Reserva", 50, 60);

        const fechaEmision = moment().format("DD/MM/YYYY HH:mm");
        doc.fillColor("#000").font("Helvetica-Bold").fontSize(14)
          .text(`Reserva Nº ${r.reserva_id}`, 50, 120);
        doc.font("Helvetica").fontSize(10)
          .text(`Emitido: ${fechaEmision}`, 400, 125, { align: "right" });

        doc.rect(50, 150, doc.page.width - 100, 100).fill(grisFondo);
        doc.fillColor("#000").font("Helvetica").fontSize(11);

        const fecha = r.fecha_reserva ? moment(r.fecha_reserva).format("DD/MM/YYYY") : "-";
        const turno = r.turno
          ? `${r.turno.hora_desde?.slice(0, 5)} - ${r.turno.hora_hasta?.slice(0, 5)}`
          : "-";
        const cliente = `${r.usuario?.nombre ?? ""} ${r.usuario?.apellido ?? ""}`.trim() || "Cliente no identificado";
        const salon = r.salon?.titulo ?? "Sin salón";
        const capacidad = r.salon?.capacidad ? `${r.salon.capacidad} personas` : "";
        const tematica = r.tematica ?? "-";

        let y = 165;
        doc.text(`Fecha de reserva: ${fecha}`, 70, y);
        doc.text(`Turno: ${turno}`, 330, y);
        y += 20;
        doc.text(`Cliente: ${cliente}`, 70, y);
        y += 20;
        doc.text(`Salón: ${salon}${capacidad ? ` (${capacidad})` : ""}`, 70, y);
        y += 20;
        doc.text(`Temática: ${tematica}`, 70, y);

        doc.font("Helvetica-Bold").fontSize(12).fillColor(azul);
        y += 60;
        doc.text("Servicios contratados", 50, y);
        y += 15;
        doc.strokeColor("#ccc").moveTo(50, y).lineTo(doc.page.width - 50, y).stroke();
        y += 10;
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#000");
        doc.text("Descripción", 60, y);
        doc.text("Importe", 430, y, { align: "right" });

        y += 15;
        doc.strokeColor("#ccc").moveTo(50, y).lineTo(doc.page.width - 50, y).stroke();
        y += 10;
        doc.font("Helvetica").fontSize(10).fillColor(gris);

        if (r.servicios?.length) {
          r.servicios.forEach((s) => {
            doc.text(s.descripcion, 60, y);
            doc.text(`$${Number(s.importe).toLocaleString()}`, 430, y, { align: "right" });
            y += 18;
          });
        } else {
          doc.text("No hay servicios asociados.", 60, y);
          y += 20;
        }

        const leftMargin = doc.page.margins.left;
        const rightMargin = doc.page.margins.right;

        const montoSalon = r.importe_salon
          ? `$${Number(r.importe_salon).toLocaleString("es-AR")}`
          : "-";
        const totalReserva = r.importe_total
          ? `$${Number(r.importe_total).toLocaleString("es-AR")}`
          : "-";

        y += 40;
        doc.strokeColor("#ccc")
          .moveTo(leftMargin, y)
          .lineTo(doc.page.width - rightMargin, y)
          .stroke();

        const importeColX = 508; 
        const etiquetaX = 330;
        const lineGap = 25;

        y += 25;
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#000");
        doc.text("Importe Salón:", etiquetaX, y, { align: "left" });
        doc.font("Helvetica").fontSize(11).fillColor("#000");
        doc.text(montoSalon, importeColX, y, {
          align: "right",
          width: 80,
          lineBreak: false,
        });

        y += lineGap * 1.8;
        doc.strokeColor("#004a7c")
          .moveTo(etiquetaX, y - 5)
          .lineTo(importeColX + 50, y - 5)
          .stroke();

        doc.font("Helvetica-Bold").fontSize(12).fillColor("#004a7c");
        doc.text("TOTAL RESERVA:", etiquetaX, y, { align: "left" });
        doc.font("Helvetica-Bold").fontSize(12).fillColor("#000");
        doc.text(totalReserva, importeColX, y, {
          align: "right",
          width: 80,
          lineBreak: false,
        });


        const footerY = doc.page.height - 80;
        doc.moveTo(50, footerY - 10).lineTo(doc.page.width - 50, footerY - 10).strokeColor(azul).stroke();
        doc.font("Helvetica-Oblique").fontSize(9).fillColor(gris)
          .text("Tecnicatura Universitaria en Desarrollo Web – Programación III", 50, footerY, {
            align: "center",
            width: doc.page.width - 100,
          });
        doc.fontSize(8).fillColor("#777")
          .text("Documento generado automáticamente – Proyecto PROGIII", 50, footerY + 15, {
            align: "center",
            width: doc.page.width - 100,
          });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  },
};
