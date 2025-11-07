import cors from 'cors';

process.loadEnvFile();

const NODE_ENV = process.env.NODE_ENV || 'development';
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawOrigins
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const serverOrigin = `http://localhost:${process.env.PORT || 4000}`;
if (!allowedOrigins.includes(serverOrigin)) allowedOrigins.push(serverOrigin);

function isLocalhost(origin) {
  return (
    origin?.startsWith('http://localhost:') ||
    origin?.startsWith('http://127.0.0.1:')
  );
}

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (NODE_ENV !== 'production' && isLocalhost(origin)) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || origin === serverOrigin) {
      return callback(null, true);
    }

    console.warn(`CORS bloqueado desde origen no permitido: ${origin}`);
    return callback(new Error(`CORS no permitido desde: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
