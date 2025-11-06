import pool from './db.js';

export async function initDatabase() {
  try {
    await crearTablasBase();
    await crearStoredProcedures();
    await insertarNotasInternasIniciales();
    await insertarEncuestasIniciales();

    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error durante la inicialización de la base de datos:', error.message);
  }
}

async function crearTablasBase() {
  const createComentariosTable = `
    CREATE TABLE IF NOT EXISTS comentarios_reservas (
      comentario_id INT AUTO_INCREMENT PRIMARY KEY,
      reserva_id INT NOT NULL,
      usuario_id INT NOT NULL,
      comentario TEXT NOT NULL,
      calificacion TINYINT DEFAULT NULL,
      activo TINYINT DEFAULT 1,
      creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      modificado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_comentario_reserva FOREIGN KEY (reserva_id)
        REFERENCES reservas(reserva_id) ON DELETE CASCADE,
      CONSTRAINT fk_comentario_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(usuario_id) ON DELETE CASCADE
    );
  `;
  await pool.query(createComentariosTable);

  const createEncuestasTable = `
    CREATE TABLE IF NOT EXISTS encuestas (
      encuesta_id INT AUTO_INCREMENT PRIMARY KEY,
      reserva_id INT NOT NULL,
      usuario_id INT NOT NULL,
      puntuacion TINYINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
      comentario TEXT,
      activo TINYINT DEFAULT 1,
      creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      modificado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_encuesta_reserva FOREIGN KEY (reserva_id)
        REFERENCES reservas(reserva_id) ON DELETE CASCADE,
      CONSTRAINT fk_encuesta_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(usuario_id) ON DELETE CASCADE
    );
  `;
  await pool.query(createEncuestasTable);
}

async function insertarNotasInternasIniciales() {
  const notas = [
    {
      reserva_id: 1,
      comentario: 'Cliente abonó el 50% del importe total. Falta confirmar menú del catering y animación.',
    },
    {
      reserva_id: 2,
      comentario: 'Reserva pendiente de confirmación del tema de decoración (superhéroes).',
    },
  ];

  for (const n of notas) {
    const [existe] = await pool.query(
      `SELECT comentario_id FROM comentarios_reservas 
       WHERE reserva_id = ? AND usuario_id = 8 AND comentario = ?`,
      [n.reserva_id, n.comentario]
    );

    if (existe.length === 0) {
      await pool.query(
        `INSERT INTO comentarios_reservas (reserva_id, usuario_id, comentario)
         VALUES (?, 8, ?)`,
        [n.reserva_id, n.comentario]
      );
    }
  }
}

async function insertarEncuestasIniciales() {
  const encuestas = [
    {
      reserva_id: 1,
      usuario_id: 1,
      puntuacion: 5,
      comentario: 'Excelente servicio, los niños se divirtieron muchísimo.',
    },
    {
      reserva_id: 2,
      usuario_id: 2,
      puntuacion: 4,
      comentario: 'Muy buena atención, aunque el catering podría mejorar.',
    },
  ];

  for (const e of encuestas) {
    const [[reservaExiste]] = await pool.query(
      'SELECT reserva_id FROM reservas WHERE reserva_id = ?',
      [e.reserva_id]
    );
    const [[usuarioExiste]] = await pool.query(
      'SELECT usuario_id FROM usuarios WHERE usuario_id = ?',
      [e.usuario_id]
    );

    if (reservaExiste && usuarioExiste) {
      const [existe] = await pool.query(
        'SELECT encuesta_id FROM encuestas WHERE reserva_id = ?',
        [e.reserva_id]
      );

      if (existe.length === 0) {
        await pool.query(
          `INSERT INTO encuestas (reserva_id, usuario_id, puntuacion, comentario)
           VALUES (?, ?, ?, ?)`,
          [e.reserva_id, e.usuario_id, e.puntuacion, e.comentario]
        );
      }
    } else {
      console.warn(
        `No se pudo insertar encuesta: reserva ${e.reserva_id} o usuario ${e.usuario_id} no existen.`
      );
    }
  }
}

async function crearStoredProcedures() {
  await pool.query('DROP PROCEDURE IF EXISTS sp_informe_general;');

  const createSP = `
    CREATE PROCEDURE sp_informe_general(
      IN fecha_desde DATE,
      IN fecha_hasta DATE
    )
    BEGIN
        SELECT 
            s.salon_id,
            s.titulo AS salon,
            COUNT(r.reserva_id) AS total_reservas,
            IFNULL(SUM(r.importe_total), 0) AS ingresos_totales
        FROM salones s
        LEFT JOIN reservas r 
            ON s.salon_id = r.salon_id 
            AND r.activo = 1
            AND (r.fecha_reserva BETWEEN IFNULL(fecha_desde, '1900-01-01') 
                                     AND IFNULL(fecha_hasta, CURDATE()))
        GROUP BY s.salon_id;

        SELECT 
            u.usuario_id,
            CONCAT(u.nombre, ' ', u.apellido) AS cliente,
            COUNT(r.reserva_id) AS total_reservas,
            IFNULL(SUM(r.importe_total), 0) AS total_gastado
        FROM usuarios u
        LEFT JOIN reservas r 
            ON u.usuario_id = r.usuario_id 
            AND r.activo = 1
            AND (r.fecha_reserva BETWEEN IFNULL(fecha_desde, '1900-01-01') 
                                     AND IFNULL(fecha_hasta, CURDATE()))
        WHERE u.tipo_usuario = 3
        GROUP BY u.usuario_id;

        SELECT 
            COUNT(r.reserva_id) AS total_reservas,
            IFNULL(SUM(r.importe_total), 0) AS ingresos_totales,
            IFNULL(AVG(r.importe_total), 0) AS promedio_por_reserva
        FROM reservas r
        WHERE r.activo = 1
        AND (r.fecha_reserva BETWEEN IFNULL(fecha_desde, '1900-01-01') 
                                 AND IFNULL(fecha_hasta, CURDATE()));

        SELECT 
            CASE u.tipo_usuario
                WHEN 1 THEN 'Administrador'
                WHEN 2 THEN 'Empleado'
                WHEN 3 THEN 'Cliente'
                ELSE 'Desconocido'
            END AS rol,
            COUNT(*) AS total_usuarios
        FROM usuarios u
        WHERE u.activo = 1
        GROUP BY u.tipo_usuario;

        SELECT 
            s.descripcion AS servicio,
            COUNT(rs.servicio_id) AS veces_contratado,
            IFNULL(SUM(rs.importe), 0) AS ingresos_por_servicio
        FROM servicios s
        LEFT JOIN reservas_servicios rs 
            ON s.servicio_id = rs.servicio_id
        LEFT JOIN reservas r 
            ON r.reserva_id = rs.reserva_id
            AND (r.fecha_reserva BETWEEN IFNULL(fecha_desde, '1900-01-01') 
                                     AND IFNULL(fecha_hasta, CURDATE()))
        GROUP BY s.servicio_id
        ORDER BY veces_contratado DESC;

        SELECT 
            COUNT(c.comentario_id) AS total_notas_internas,
            COUNT(DISTINCT c.reserva_id) AS reservas_con_notas
        FROM comentarios_reservas c
        WHERE c.activo = 1;
    END;
  `;
  await pool.query(createSP);
}
