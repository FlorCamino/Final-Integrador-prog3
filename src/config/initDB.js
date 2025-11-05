import pool from './db.js';

export async function initDatabase() {
  console.log('Iniciando verificación de base de datos...');

  try {
    await crearTablasBase();
  } catch (err) {
    console.error('Error al crear/verificar tablas base:', err.message);
  }

  try {
    await crearStoredProcedures();
  } catch (err) {
    console.error('Error al crear procedimientos almacenados:', err.message);
  }

  try {
    await insertarNotasInternasIniciales();
  } catch (err) {
    console.error('Error al insertar comentarios internos:', err.message);
  }

  console.log('Inicialización de base de datos completada (con o sin errores).');
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
  console.log('Tabla "comentarios_reservas" verificada o creada.');
}

async function insertarNotasInternasIniciales() {
  console.log('Agregando notas internas iniciales del administrador...');

  const notas = [
    {
      reserva_id: 1,
      comentario: 'Cliente abonó el 50% del importe total. Falta confirmar catering.',
    },
    {
      reserva_id: 2,
      comentario: 'Reserva pendiente de confirmación de decoración temática.',
    },
    {
      reserva_id: 3,
      comentario: 'Pago completo realizado. Pendiente entrega de factura.',
    },
  ];

  for (const n of notas) {
    try {
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
        console.log(`Nota interna agregada a reserva #${n.reserva_id}`);
      } else {
        console.log(`Nota ya existente en reserva #${n.reserva_id}`);
      }
    } catch (err) {
      console.error(`Error al insertar nota interna en reserva #${n.reserva_id}:`, err.message);
    }
  }

  console.log('Notas internas verificadas o creadas.');
}

async function crearStoredProcedures() {
  try {
    await pool.query('DROP PROCEDURE IF EXISTS sp_informe_general;');
  } catch (err) {
    console.error('Error al eliminar SP existente:', err.message);
  }

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
  console.log('Procedimiento almacenado "sp_informe_general" creado/actualizado.');
}
