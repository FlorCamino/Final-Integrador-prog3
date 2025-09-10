const consultasSQL = {
  obtenerTodas: `
    SELECT reserva_id, fecha_reserva, salon_id, usuario_id, turno_id,
           foto_cumpleaniero, tematica, importe_salon, importe_total,
           activo, creado, modificado
    FROM reservas
    WHERE activo = 1
    ORDER BY fecha_reserva DESC
  `,

  obtenerPorId: `
    SELECT reserva_id, fecha_reserva, salon_id, usuario_id, turno_id,
           foto_cumpleaniero, tematica, importe_salon, importe_total,
           activo, creado, modificado
    FROM reservas
    WHERE reserva_id = ?
  `,

  crear: `
    INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  eliminar: `
    UPDATE reservas
      SET activo = 0,
          modificado = NOW()
    WHERE reserva_id = ?>
  `,
};

export default consultasSQL;
