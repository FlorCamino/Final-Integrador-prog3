import { ejecutarConsulta, obtenerPool } from '../config/db.js';
import { ErrorResponse } from '../utils/errorResponse.js';

export default class Reservas {
  buscarTodasReservas = async ({ limit, offset, estado, sort, order }) => {
    let baseQuery = 'FROM reservas WHERE 1=1 ';
    const params = [];

    if (estado !== undefined) {
      baseQuery += ' AND activo = ?';
      params.push(estado);
    } else {
      baseQuery += ' AND activo = 1';
    }

    const validSortFields = [
      'fecha_reserva',
      'salon_id',
      'turno_id',
      'tematica',
      'importe_salon',
      'importe_total',
      'creado',
      'modificado',
    ];
    const sortField = validSortFields.includes(sort) ? sort : null;
    const direction =
      typeof order === 'string' && order.toLocaleUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `SELECT * ${baseQuery}`;
    if (sortField) query += ` ORDER BY ${sortField} ${direction}`;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await ejecutarConsulta(query, params);
    return { rows };
  };

  async crearReserva({
    fecha_reserva,
    salon_id,
    usuario_id,
    turno_id,
    foto_cumpleaniero,
    tematica,
    importe_salon,
    importe_total,
    servicios = [],
  }) {
    const conn = await obtenerPool().getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO reservas 
         (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total, activo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          fecha_reserva,
          salon_id,
          usuario_id,
          turno_id,
          foto_cumpleaniero,
          tematica,
          importe_salon,
          importe_total,
        ]
      );
      const reserva_id = result.insertId;

      for (const s of servicios) {
        await conn.query(
          'INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)',
          [reserva_id, s.servicio_id, s.importe]
        );
      }

      const [rows] = await conn.query(
        `SELECT 
          r.reserva_id,
          r.fecha_reserva,
          r.tematica,
          r.importe_salon,
          r.importe_total,
          s.titulo AS salon,
          CONCAT(t.hora_desde, ' - ', t.hora_hasta) AS turno,
          u.nombre AS nombreCliente,
          u.apellido AS apellidoCliente,
          u.nombre_usuario AS emailCliente
        FROM reservas r
        JOIN usuarios u ON r.usuario_id = u.usuario_id
        JOIN salones s ON r.salon_id = s.salon_id
        JOIN turnos t ON r.turno_id = t.turno_id
        WHERE r.reserva_id = ?`,
        [reserva_id]
      );

      const reservaBase = rows[0];
      if (!reservaBase) throw new ErrorResponse('No se pudo recuperar la reserva creada.', 500);

      const [serviciosRows] = await conn.query(
        `SELECT 
           se.servicio_id,
           se.descripcion,
           rs.importe
         FROM reservas_servicios rs
         JOIN servicios se ON rs.servicio_id = se.servicio_id
         WHERE rs.reserva_id = ?`,
        [reserva_id]
      );

      await conn.commit();

      return {
        reserva_id,
        fecha_reserva: reservaBase.fecha_reserva,
        tematica: reservaBase.tematica,
        importe_salon: reservaBase.importe_salon,
        importe_total: reservaBase.importe_total,
        salon: reservaBase.salon,
        turno: reservaBase.turno,
        nombreCliente: `${reservaBase.nombreCliente} ${reservaBase.apellidoCliente}`,
        emailCliente: reservaBase.emailCliente,
        servicios: serviciosRows,
        foto_cumpleaniero,
      };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async modificarReservaPorId(reserva_id, datos) {
    const {
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
    } = datos;

    const query = `UPDATE reservas 
                   SET fecha_reserva = ?, salon_id = ?, usuario_id = ?, turno_id = ?, 
                       foto_cumpleaniero = ?, tematica = ?, importe_salon = ?, importe_total = ? 
                   WHERE reserva_id = ?`;
    const [result] = await ejecutarConsulta(query, [
      fecha_reserva,
      salon_id,
      usuario_id,
      turno_id,
      foto_cumpleaniero,
      tematica,
      importe_salon,
      importe_total,
      reserva_id,
    ]);
    return result;
  }

  async buscarDisponibilidad({ salon_id, turno_id, fecha_reserva, excluir_id = null }) {
    let query = `
      SELECT COUNT(*) AS ocupadas
      FROM reservas
      WHERE salon_id = ? AND turno_id = ? AND fecha_reserva = ? AND activo = 1
    `;
    const params = [salon_id, turno_id, fecha_reserva];
    if (excluir_id) {
      query += ' AND reserva_id <> ?';
      params.push(excluir_id);
    }
    const [rows] = await ejecutarConsulta(query, params);
    return rows[0].ocupadas === 0;
  }

  async validarEntidadesActivas({ usuario_id, salon_id, turno_id, servicios }) {
    const [u] = await ejecutarConsulta(
      'SELECT 1 FROM usuarios WHERE usuario_id = ? AND activo = 1',
      [usuario_id]
    );
    if (!u.length) throw new ErrorResponse('El usuario no está activo o no existe.', 400);

    const [s] = await ejecutarConsulta(
      'SELECT 1 FROM salones WHERE salon_id = ? AND activo = 1',
      [salon_id]
    );
    if (!s.length) throw new ErrorResponse('El salón no está activo o no existe.', 400);

    const [t] = await ejecutarConsulta(
      'SELECT 1 FROM turnos WHERE turno_id = ? AND activo = 1',
      [turno_id]
    );
    if (!t.length) throw new ErrorResponse('El turno no está activo o no existe.', 400);

    const ids = servicios?.map((s) => s.servicio_id);
    if (ids?.length) {
      const [serviciosActivos] = await ejecutarConsulta(
        'SELECT COUNT(*) AS activos FROM servicios WHERE servicio_id IN (?) AND activo = 1',
        [ids]
      );
      if (serviciosActivos[0].activos !== ids.length)
        throw new ErrorResponse(
          'Alguno de los servicios seleccionados no está activo o disponible.',
          400
        );
    }
  }

  async desactivarReservaEnCascada(reserva_id) {
    const conn = await obtenerPool().getConnection();
    try {
      await conn.beginTransaction();

      await conn.query('UPDATE reservas SET activo = 0 WHERE reserva_id = ?', [reserva_id]);
      // No se puede desactivar la reserva servicio porque no tiene el campo activo (solo se puede hacer un delete fisico)
      // await conn.query('DELETE FROM reservas_servicios WHERE reserva_id = ?', [reserva_id]);
      await conn.query('UPDATE comentarios_reservas SET activo = 0 WHERE reserva_id = ?', [reserva_id]);

      await conn.commit();
      return { affectedRows: 1 };
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async obtenerReportePorRango(desde, hasta) {
    const query = `
      SELECT 
        r.reserva_id,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        r.fecha_reserva,
        CONCAT(t.hora_desde, ' - ', t.hora_hasta) AS turno,
        r.tematica,
        s.titulo AS salon,
        r.importe_salon,
        GROUP_CONCAT(DISTINCT se.descripcion ORDER BY se.descripcion SEPARATOR ', ') AS descripcion_servicio,
        COALESCE(SUM(se.importe), 0) AS importe_servicios,
        (r.importe_salon + COALESCE(SUM(se.importe), 0)) AS costo_total
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN turnos t ON r.turno_id = t.turno_id
      LEFT JOIN reservas_servicios rs ON r.reserva_id = rs.reserva_id
      LEFT JOIN servicios se ON se.servicio_id = rs.servicio_id
      WHERE r.activo = 1
        AND r.fecha_reserva BETWEEN ? AND ?
      GROUP BY r.reserva_id
      ORDER BY r.fecha_reserva ASC, r.reserva_id ASC;
    `;
    const [rows] = await ejecutarConsulta(query, [desde, hasta]);
    return rows;
  }

  async buscarReservasDetalladasPorUsuario(usuario_id, { limit = 10, offset = 0 }) {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const [reservas] = await ejecutarConsulta(
      `
      SELECT 
        r.reserva_id,
        r.fecha_reserva,
        r.tematica,
        r.importe_salon,
        r.importe_total,
        r.activo,
        r.creado,
        r.modificado,
        s.salon_id,
        s.titulo AS salon_titulo,
        s.capacidad AS salon_capacidad,
        t.turno_id,
        CONCAT(t.hora_desde, ' - ', t.hora_hasta) AS turno_descripcion,
        t.hora_desde,
        t.hora_hasta,
        u.usuario_id,
        u.nombre AS usuario_nombre,
        u.apellido AS usuario_apellido,
        u.nombre_usuario AS usuario_email 
      FROM reservas r
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN turnos t ON r.turno_id = t.turno_id
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      WHERE r.activo = 1 AND r.usuario_id = ?
      ORDER BY r.fecha_reserva DESC
      LIMIT ? OFFSET ?
      `,
      [usuario_id, limit, offset]
    );

    const reservaIds = reservas.map(r => r.reserva_id);
    if (reservaIds.length === 0) return [];

    const [servicios] = await ejecutarConsulta(
      `
      SELECT rs.reserva_id, se.servicio_id, se.descripcion, rs.importe
      FROM reservas_servicios rs
      JOIN servicios se ON rs.servicio_id = se.servicio_id
      WHERE rs.reserva_id IN (?) AND se.activo = 1
      `,
      [reservaIds]
    );

    return reservas.map(r => ({
      reserva_id: r.reserva_id,
      fecha_reserva: r.fecha_reserva,
      tematica: r.tematica,
      importe_salon: r.importe_salon,
      importe_total: r.importe_total,
      salon: {
        titulo: r.salon_titulo,
        capacidad: r.salon_capacidad
      },
      turno: {
        descripcion: r.turno_descripcion,
        hora_desde: r.hora_desde,
        hora_hasta: r.hora_hasta
      },
      usuario: {
        nombre: r.usuario_nombre,
        apellido: r.usuario_apellido,
        email: r.usuario_email
      },
      servicios: servicios.filter(s => s.reserva_id === r.reserva_id)
    }));
  }

  async buscarReservaPorId(id) {
    const [rows] = await ejecutarConsulta(
      `
      SELECT 
        r.reserva_id,
        r.fecha_reserva,
        r.tematica,
        r.importe_salon,
        r.importe_total,
        s.titulo AS salon,
        CONCAT(t.hora_desde, ' - ', t.hora_hasta) AS turno,
        u.usuario_id,
        u.nombre AS nombreCliente,
        u.apellido AS apellidoCliente,
        u.nombre_usuario AS emailCliente
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN turnos t ON r.turno_id = t.turno_id
      WHERE r.reserva_id = ? AND r.activo = 1
      `,
      [id]
    );

    if (!rows.length) return null;

    const reserva = rows[0];

    const [servicios] = await ejecutarConsulta(
      `
      SELECT 
        se.servicio_id,
        se.descripcion,
        rs.importe
      FROM reservas_servicios rs
      JOIN servicios se ON rs.servicio_id = se.servicio_id
      WHERE rs.reserva_id = ? AND se.activo = 1
      `,
      [id]
    );

    return {
      reserva_id: reserva.reserva_id,
      usuario_id: reserva.usuario_id,
      fecha_reserva: reserva.fecha_reserva,
      tematica: reserva.tematica,
      importe_salon: reserva.importe_salon,
      importe_total: reserva.importe_total,
      salon: reserva.salon,
      turno: reserva.turno,
      nombreCliente: `${reserva.nombreCliente} ${reserva.apellidoCliente}`,
      emailCliente: reserva.emailCliente,
      servicios,
    };
  }

  async buscarReservasDetalladas({ limit = 10, offset = 0 }) {
    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (isNaN(offset) || offset < 0) offset = 0;

    const [reservas] = await ejecutarConsulta(
      `
      SELECT 
        r.reserva_id,
        r.fecha_reserva,
        r.tematica,
        r.importe_salon,
        r.importe_total,
        r.activo,
        r.creado,
        r.modificado,
        s.salon_id,
        s.titulo AS salon_titulo,
        s.capacidad AS salon_capacidad,
        t.turno_id,
        CONCAT(t.hora_desde, ' - ', t.hora_hasta) AS turno_descripcion,
        t.hora_desde,
        t.hora_hasta,
        u.usuario_id,
        u.nombre AS usuario_nombre,
        u.apellido AS usuario_apellido,
        u.nombre_usuario AS usuario_email
      FROM reservas r
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN turnos t ON r.turno_id = t.turno_id
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      WHERE r.activo = 1
      ORDER BY r.fecha_reserva DESC, r.turno_id ASC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    const reservaIds = reservas.map(r => r.reserva_id);
    if (reservaIds.length === 0) return [];

    const [servicios] = await ejecutarConsulta(
      `
      SELECT 
        rs.reserva_id,
        se.servicio_id,
        se.descripcion,
        rs.importe
      FROM reservas_servicios rs
      JOIN servicios se ON rs.servicio_id = se.servicio_id
      WHERE rs.reserva_id IN (?) AND se.activo = 1
      `,
      [reservaIds]
    );

    return reservas.map(r => ({
      reserva_id: r.reserva_id,
      fecha_reserva: r.fecha_reserva,
      tematica: r.tematica,
      importe_salon: r.importe_salon,
      importe_total: r.importe_total,
      salon: {
        salon_id: r.salon_id,
        titulo: r.salon_titulo,
        capacidad: r.salon_capacidad
      },
      turno: {
        turno_id: r.turno_id,
        descripcion: r.turno_descripcion,
        hora_desde: r.hora_desde,
        hora_hasta: r.hora_hasta
      },
      usuario: {
        usuario_id: r.usuario_id,
        nombre: r.usuario_nombre,
        apellido: r.usuario_apellido,
        email: r.usuario_email
      },
      servicios: servicios.filter(s => s.reserva_id === r.reserva_id)
    }));
  }

  async obtenerReportePorRango(desde, hasta) {
    try {
      const query = `
        SELECT 
          r.reserva_id,
          CONCAT(u.nombre, ' ', u.apellido) AS cliente,
          u.nombre_usuario AS emailCliente,
          r.fecha_reserva,
          CONCAT(t.hora_desde, ' - ', t.hora_hasta) AS turno,
          r.tematica,
          s.titulo AS salon,
          s.capacidad AS capacidad_salon,
          r.importe_salon,
          COALESCE(SUM(rs.importe), 0) AS importe_servicios,
          (r.importe_salon + COALESCE(SUM(rs.importe), 0)) AS total_reserva,
          COUNT(DISTINCT rs.servicio_id) AS cantidad_servicios
        FROM reservas r
        JOIN usuarios u ON r.usuario_id = u.usuario_id
        JOIN salones s ON r.salon_id = s.salon_id
        JOIN turnos t ON r.turno_id = t.turno_id
        LEFT JOIN reservas_servicios rs ON r.reserva_id = rs.reserva_id
        WHERE r.activo = 1
          AND r.fecha_reserva BETWEEN ? AND ?
        GROUP BY 
          r.reserva_id, u.nombre, u.apellido, u.nombre_usuario, 
          s.titulo, s.capacidad, t.hora_desde, t.hora_hasta
        ORDER BY r.fecha_reserva ASC, r.reserva_id ASC;
      `;

      const [rows] = await ejecutarConsulta(query, [desde, hasta]);
      return rows;
    } catch (error) {
      console.error('Error al generar el informe estadístico:', error.message);
      throw new ErrorResponse('No se pudo generar el informe estadístico.', 500);
    }
  }

  async buscarReservaDetalladaPorId(id) {
    const [rows] = await ejecutarConsulta(
      `
      SELECT 
        r.reserva_id,
        r.fecha_reserva,
        r.tematica,
        r.foto_cumpleaniero,
        s.salon_id,
        s.titulo AS salon_titulo,
        s.capacidad AS salon_capacidad,
        s.importe AS importe_salon,
        CONCAT(t.hora_desde, ' - ', t.hora_hasta) AS turno_descripcion,
        u.usuario_id,
        u.nombre AS nombreCliente,
        u.apellido AS apellidoCliente,
        u.nombre_usuario AS emailCliente
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.usuario_id
      JOIN salones s ON r.salon_id = s.salon_id
      JOIN turnos t ON r.turno_id = t.turno_id
      WHERE r.reserva_id = ? AND r.activo = 1
      `,
      [id]
    );

    if (!rows.length) return null;
    const reserva = rows[0];

    const importeSalon = Number(reserva.importe_salon) || 0;

    const [servicios] = await ejecutarConsulta(
      `
      SELECT 
        rs.servicio_id,
        se.descripcion,
        rs.importe
      FROM reservas_servicios rs
      JOIN servicios se ON rs.servicio_id = se.servicio_id
      WHERE rs.reserva_id = ? AND se.activo = 1
      `,
      [id]
    );

    const serviciosNumericos = servicios.map((s) => ({
      ...s,
      importe: Number(s.importe) || 0,
    }));

    const totalServicios = serviciosNumericos.reduce((sum, s) => sum + s.importe, 0);
    const totalReserva = importeSalon + totalServicios;

    return {
      reserva_id: reserva.reserva_id,
      fecha_reserva: reserva.fecha_reserva,
      tematica: reserva.tematica,
      foto_cumpleaniero: reserva.foto_cumpleaniero,
      importe_salon: importeSalon,
      importe_total: totalReserva,
      salon: {
        salon_id: reserva.salon_id,
        titulo: reserva.salon_titulo,
        capacidad: reserva.salon_capacidad,
      },
      turno: {
        descripcion: reserva.turno_descripcion,
      },
      usuario: {
        usuario_id: reserva.usuario_id,
        nombre: reserva.nombreCliente,
        apellido: reserva.apellidoCliente,
        email: reserva.emailCliente,
      },
      servicios: serviciosNumericos,
    };
  }

}
