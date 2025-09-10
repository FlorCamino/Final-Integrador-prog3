export const transformarReservaParaDatos = (fila) => {
  if (!fila) return null;

  return {
    id: fila.reserva_id,
    usuarioId: fila.usuario_id,
    salonId: fila.salon_id,
    turnoId: fila.turno_id,
    fechaReserva: fila.fecha_reserva,
    fotoCumpleañero: fila.foto_cumpleaniero,
    tematica: fila.tematica,
    importeSalon: fila.importe_salon,
    importeTotal: fila.importe_total,
    activo: fila.activo,
    creado: fila.creado,
    modificado: fila.modificado,
  };
};

export const transformarReservaParaBD = (datos) => {
  if (!datos) return null;

  return {
    usuario_id: datos.usuarioId !== undefined ? Number(datos.usuarioId) : null,
    salon_id: datos.salonId !== undefined ? Number(datos.salonId) : null,
    turno_id: datos.turnoId !== undefined ? Number(datos.turnoId) : null,
    fecha_reserva: datos.fechaReserva ?? null,
    foto_cumpleaniero: datos.fotoCumpleaniero ?? null,
    tematica: datos.tematica ?? null,
    importe_salon: datos.importeSalon ?? 0,
    importe_total: datos.importeTotal ?? 0,
    activo: datos.activo !== undefined ? Number(datos.activo) : 1,
  }
};

export const transformarParcialReservaParaBD = (datos) => {
  const campos = {};

  if ("fotoCumpleaniero" in datos) campos.foto_cumpleaniero = datos.fotoCumpleaniero;
  if ("tematica" in datos) campos.tematica = datos.tematica;
  if ("fechaReserva" in datos) campos.fecha_reserva = datos.fechaReserva;
  if ("salonId" in datos) campos.salon_id = datos.salonId;
  if ("usuarioId" in datos) campos.usuario_id = datos.usuarioId;
  if ("turnoId" in datos) campos.turno_id = datos.turnoId;
  if ("importeSalon" in datos) campos.importe_salon = datos.importeSalon;
  if ("importeTotal" in datos) campos.importe_total = datos.importeTotal;
  if ("activo" in datos) campos.activo = datos.activo;

  return campos;
};
