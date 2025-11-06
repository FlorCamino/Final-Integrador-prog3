import multer from 'multer';
import path from 'path';
import fs from 'fs';
import UsuariosService from '../services/usuarios.service.js';

export default class MulterConfig {
  constructor() {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    this.usuariosService = new UsuariosService();

    this.storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),

      filename: async (req, file, cb) => {
        try {
          let { usuario_id, fecha_reserva } = req.body;
          let nombreUsuario = 'usuario';

          if (!usuario_id && req.user?.usuario_id) {
            usuario_id = req.user.usuario_id;
          }

          if (usuario_id) {
            const usuario = await this.usuariosService.buscarPorId(usuario_id);
            if (usuario?.nombre) {
              nombreUsuario = usuario.nombre.toLowerCase().replace(/[^a-z0-9]/g, '_');
            }
          }

          let fecha;
          if (fecha_reserva && /^\d{4}-\d{2}-\d{2}$/.test(fecha_reserva)) {
            fecha = fecha_reserva;
          } else {
            const hoy = new Date();
            fecha = hoy.toISOString().slice(0, 10);
          }

          const ext = path.extname(file.originalname);
          const filename = `${nombreUsuario}_${fecha}${ext}`;

          cb(null, filename);
        } catch (err) {
          console.error('Error al generar nombre del archivo:', err.message);
          cb(err);
        }
      },
    });

    this.fileFilter = (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const mimeType = allowedTypes.test(file.mimetype);
      const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      if (mimeType && extName) cb(null, true);
      else cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif).'));
    };

    this.limits = { fileSize: 10 * 1024 * 1024 }; 

    this.uploader = multer({
      storage: this.storage,
      fileFilter: this.fileFilter,
      limits: this.limits,
    });
  }

  single(fieldName) {
    return this.uploader.single(fieldName);
  }
}
