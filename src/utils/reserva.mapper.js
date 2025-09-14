export const transformarReservaParaDatos = (fila) => {
  if (!fila) return null;

  return {
    id: fila.reserva_id ?? fila.RESERVA_ID,
    usuarioId: fila.usuario_id ?? fila.USUARIO_ID,
    salonId: fila.salon_id ?? fila.SALON_ID,
    turnoId: fila.turno_id ?? fila.TURNO_ID,
    fechaReserva: fila.fecha_reserva ?? fila.FECHA_RESERVA,
    fotoCumpleanero: fila.foto_cumpleaniero ?? fila.FOTO_CUMPLEANIERO,
    tematica: fila.tematica ?? fila.TEMATICA,
    importeSalon: fila.importe_salon ?? fila.IMPORTE_SALON,
    importeTotal: fila.importe_total ?? fila.IMPORTE_TOTAL,
    activo: fila.activo ?? fila.ACTIVO,
    creado: fila.creado ?? fila.CREADO,
    modificado: fila.modificado ?? fila.MODIFICADO,
  };
};


export const transformarReservaParaBD = (datos) => {
  let fecha = null;
  const fechaEntrada = datos.fechaReserva || datos.fecha_reserva;

  if (fechaEntrada) {
    const d = new Date(fechaEntrada);
    if (!isNaN(d)) {
      fecha = d.toISOString().split("T")[0];
    }
  }

  return {
    usuario_id: datos.usuarioId ?? datos.usuario_id ?? null,
    salon_id: datos.salonId ?? datos.salon_id ?? null,
    turno_id: datos.turnoId ?? datos.turno_id ?? null,
    fecha_reserva: fecha,
    foto_cumpleaniero: datos.fotoCumpleanero ?? datos.foto_cumpleaniero ?? null,
    tematica: datos.tematica ?? null,
    importe_salon: datos.importeSalon ?? datos.importe_salon ?? 0,
    importe_total: datos.importeTotal ?? datos.importe_total ?? 0,
    activo: datos.activo !== undefined ? Number(datos.activo) : 1,
  };
};


export const transformarParcialReservaParaBD = (datos) => {
  const campos = {};

  if ("fotoCumpleaniero" in datos) campos.foto_cumpleaniero = datos.fotoCumpleaniero;
  if ("tematica" in datos) campos.tematica = datos.tematica;

  if ("fechaReserva" in datos) {
    const d = new Date(datos.fechaReserva);
    if (!isNaN(d)) {
      campos.fecha_reserva = d.toISOString().split("T")[0];
    }
  }

  if ("salonId" in datos) campos.salon_id = datos.salonId;
  if ("usuarioId" in datos) campos.usuario_id = datos.usuarioId;
  if ("turnoId" in datos) campos.turno_id = datos.turnoId;
  if ("importeSalon" in datos) campos.importe_salon = datos.importeSalon;
  if ("importeTotal" in datos) campos.importe_total = datos.importeTotal;
  if ("activo" in datos) campos.activo = Number(datos.activo);

  return campos;
};
