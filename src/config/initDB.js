import pool from './db.js';

export async function initDatabase() {
  try {
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
    console.log('Tabla comentarios_reservas verificada o creada correctamente.');

    const users = [
      {
        id: 8,
        nombre: 'Admin',
        apellido: 'Test',
        nombre_usuario: 'admin@correo.com',
        hash: '$2b$10$GNSysZfCnUji1eDVQtzE1OzGSSFl7iiaviHTDSwxtWRX2GAhM59r2',
        tipo_usuario: 1,
        celular: '600111222',
        creado: '2025-09-12 21:28:52',
        modificado: '2025-10-19 22:27:23'
      },
      {
        id: 9,
        nombre: 'Empleado',
        apellido: 'Test',
        nombre_usuario: 'empleado@correo.com',
        hash: '$2b$10$OOkDHIUc.iWPpG659BLFKOFP4DzRaFhGcsaBh0efBoWhkcZ/FPxEi',
        tipo_usuario: 2,
        celular: '600333444',
        creado: '2025-09-12 21:28:52',
        modificado: '2025-10-19 22:30:55'
      },
      {
        id: 10,
        nombre: 'Cliente',
        apellido: 'Test',
        nombre_usuario: 'cliente@correo.com',
        hash: '$2b$10$/0jtHXguXIv4ekopsQ77LuJ/rrNX4hkcXi9mfcsGsXU997wfISbLO',
        tipo_usuario: 3,
        celular: '600555666',
        creado: '2025-09-12 21:28:52',
        modificado: '2025-10-19 22:33:29'
      }
    ];

    for (const user of users) {
      const [rows] = await pool.query(
        'SELECT usuario_id FROM usuarios WHERE nombre_usuario = ?',
        [user.nombre_usuario]
      );

      if (rows.length > 0) {
        await pool.query(
          `
          UPDATE usuarios
          SET contrasenia = ?, modificado = NOW()
          WHERE nombre_usuario = ?
          `,
          [user.hash, user.nombre_usuario]
        );
        console.log(`Contraseña actualizada para ${user.nombre_usuario}`);
      } else {
        await pool.query(
          `
          INSERT INTO usuarios (
            usuario_id, nombre, apellido, nombre_usuario,
            contrasenia, tipo_usuario, celular, foto, activo, creado, modificado
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 1, ?, ?)
          `,
          [
            user.id,
            user.nombre,
            user.apellido,
            user.nombre_usuario,
            user.hash,
            user.tipo_usuario,
            user.celular,
            user.creado,
            user.modificado
          ]
        );
        console.log(`Usuario creado: ${user.nombre_usuario}`);
      }
    }

    console.log('Usuarios agregados correctamente.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    throw error;
  }
}
