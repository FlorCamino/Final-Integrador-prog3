const consultasSQL = {
  obtenerTodas: `
    SELECT reserva_id, fecha_reserva, salon_id, usuario_id, turno_id,
           foto_cumpleaniero, tematica, importe_salon, importe_total,
           activo, creado, modificado
    FROM reservas
    WHERE activo = 1
  `,

  obtenerPorId: `
    SELECT reserva_id, fecha_reserva, salon_id, usuario_id, turno_id,
           foto_cumpleaniero, tematica, importe_salon, importe_total,
           activo, creado, modificado
    FROM reservas
    WHERE reserva_id = ?
  `,

  crear: `
    INSERT INTO reservas (
      fecha_reserva, salon_id, usuario_id, turno_id,
      foto_cumpleaniero, tematica, importe_salon, importe_total, activo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  eliminar: `
    UPDATE reservas
      SET activo = 0,
          modificado = NOW()
    WHERE reserva_id = ?
  `,

  verificarDuplicado: `
    SELECT reserva_id
    FROM reservas
    WHERE salon_id = ?
      AND fecha_reserva = ?
      AND turno_id = ?
    FOR UPDATE
  `,

  obtenerCompletaPorId: `
    SELECT 
      r.*, 
      u.nombre_usuario AS nombre_usuario, 
      s.titulo         AS salon,
      s.direccion      AS direccion,
      s.capacidad      AS capacidad
    FROM reservas r
    JOIN usuarios u ON r.usuario_id = u.usuario_id
    JOIN salones  s ON r.salon_id  = s.salon_id
    WHERE r.reserva_id = ?
  `,

  verificarDuplicadoExcluyendoId: `
    SELECT reserva_id
    FROM reservas
    WHERE salon_id = ?
      AND fecha_reserva = ?
      AND turno_id = ?
      AND reserva_id != ?
    FOR UPDATE
  `
};

export default consultasSQL;
