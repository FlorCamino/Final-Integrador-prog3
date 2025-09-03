require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || '',
    name: process.env.DB_NAME || 'reservas',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'supersecreto',
    expiresIn: process.env.JWT_EXPIRES || '2h',
  },

  mail: {
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'Reservas API <noreply@example.com>',
  },

  logLevel: process.env.LOG_LEVEL || 'info',
};

