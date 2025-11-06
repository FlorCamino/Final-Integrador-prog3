import cors from 'cors';

process.loadEnvFile();

const rawOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim());

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (origin === 'http://localhost:4000') return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`CORS bloqueado desde origen no permitido: ${origin}`);
      return callback(new Error(`CORS no permitido desde: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
