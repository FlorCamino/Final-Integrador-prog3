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
        CONSTRAINT fk_comentario_reserva FOREIGN KEY (reserva_id) REFERENCES reservas(reserva_id) ON DELETE CASCADE,
        CONSTRAINT fk_comentario_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
      );
    `;

    await pool.query(createComentariosTable);
    console.log('Tabla comentarios_reservas verificada o creada correctamente.');
  } catch (error) {
    console.error('Error al inicializar la base de datos', error.message);
    throw error;
  }
}
