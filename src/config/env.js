import 'dotenv/config';

export const entorno = {
  PUERTO: process.env.PUERTO,
  BD_HOST: process.env.BD_HOST,
  BD_PUERTO: process.env.BD_PUERTO,
  BD_USUARIO: process.env.BD_USUARIO,
  BD_CLAVE: process.env.BD_CLAVE,
  BD_NOMBRE: process.env.BD_NOMBRE,
  CLAVE_JWT: process.env.CLAVE_JWT,
  JWT_DURACION: process.env.JWT_DURACION,
  SMTP_SERVIDOR: process.env.SMTP_SERVIDOR,
  SMTP_PUERTO: process.env.SMTP_PUERTO,
  SMTP_USUARIO: process.env.SMTP_USUARIO,
  SMTP_CLAVE: process.env.SMTP_CLAVE,
  SMTP_DESDE: process.env.SMTP_DESDE,
  NIVEL_LOG: process.env.NIVEL_LOG,
};
