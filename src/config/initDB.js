import pool from './db.js';

export async function initDatabase() {
  try {
    console.log('Iniciando verificación de base de datos...');

    await crearTablasBase();
    await sembrarUsuariosBase();
    await crearStoredProcedures();

    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    throw error;
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
  console.log('Tabla "comentarios_reservas" verificada o creada.');
}

async function sembrarUsuariosBase() {
  const users = [
    {
      id: 8,
      nombre: 'Admin',
      apellido: 'Test',
      nombre_usuario: 'admin@correo.com',
      hash: '$2b$10$GNSysZfCnUji1eDVQtzE1OzGSSFl7iiaviHTDSwxtWRX2GAhM59r2',
      tipo_usuario: 1,
      celular: '600111222',
    },
    {
      id: 9,
      nombre: 'Empleado',
      apellido: 'Test',
      nombre_usuario: 'empleado@correo.com',
      hash: '$2b$10$OOkDHIUc.iWPpG659BLFKOFP4DzRaFhGcsaBh0efBoWhkcZ/FPxEi',
      tipo_usuario: 2,
      celular: '600333444',
    },
    {
      id: 10,
      nombre: 'Cliente',
      apellido: 'Test',
      nombre_usuario: 'cliente@correo.com',
      hash: '$2b$10$/0jtHXguXIv4ekopsQ77LuJ/rrNX4hkcXi9mfcsGsXU997wfISbLO',
      tipo_usuario: 3,
      celular: '600555666',
    },
  ];

  for (const user of users) {
    const [rows] = await pool.query(
      'SELECT usuario_id FROM usuarios WHERE nombre_usuario = ?',
      [user.nombre_usuario]
    );

    if (rows.length > 0) {
      await pool.query(
        `UPDATE usuarios
         SET contrasenia = ?, modificado = NOW()
         WHERE nombre_usuario = ?`,
        [user.hash, user.nombre_usuario]
      );
      console.log(`Contraseña actualizada para ${user.nombre_usuario}`);
    } else {
      await pool.query(
        `INSERT INTO usuarios (
          usuario_id, nombre, apellido, nombre_usuario,
          contrasenia, tipo_usuario, celular, foto, activo, creado, modificado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 1, NOW(), NOW())`,
        [
          user.id,
          user.nombre,
          user.apellido,
          user.nombre_usuario,
          user.hash,
          user.tipo_usuario,
          user.celular,
        ]
      );
      console.log(`Usuario creado: ${user.nombre_usuario}`);
    }
  }

  console.log('Usuarios base verificados o actualizados.');
}

async function crearStoredProcedures() {
  const dropSP = `DROP PROCEDURE IF EXISTS sp_informe_general;`;
  await pool.query(dropSP);

  const createSP = `
    CREATE PROCEDURE sp_informe_general(
      IN fecha_desde DATE,
      IN fecha_hasta DATE
    )
    BEGIN
        -- 1️ Reservas por salón
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

        -- 2️ Reservas por cliente
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

        -- 3️ Totales generales
        SELECT 
            COUNT(r.reserva_id) AS total_reservas,
            IFNULL(SUM(r.importe_total), 0) AS ingresos_totales,
            IFNULL(AVG(r.importe_total), 0) AS promedio_por_reserva
        FROM reservas r
        WHERE r.activo = 1
        AND (r.fecha_reserva BETWEEN IFNULL(fecha_desde, '1900-01-01') 
                                 AND IFNULL(fecha_hasta, CURDATE()));

        -- 4️ Usuarios por rol
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

        -- 5️ Servicios más contratados
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

        -- 6️ Comentarios y calificaciones promedio
        SELECT 
            COUNT(c.comentario_id) AS total_comentarios,
            IFNULL(AVG(c.calificacion), 0) AS calificacion_promedio
        FROM comentarios_reservas c
        LEFT JOIN reservas r 
            ON c.reserva_id = r.reserva_id
        WHERE (r.fecha_reserva BETWEEN IFNULL(fecha_desde, '1900-01-01') 
                                   AND IFNULL(fecha_hasta, CURDATE()));
    END;
  `;

  await pool.query(createSP);
  console.log('Procedimiento almacenado "sp_informe_general" creado/actualizado.');
}
