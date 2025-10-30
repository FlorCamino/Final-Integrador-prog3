import express from 'express';
import apicache from 'apicache';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import passport from 'passport';

import { estrategia, validacion } from './config/passport.js';
import { CacheMiddleware } from './middlewares/cache/CacheMiddleware.js';
import { GetCache } from './middlewares/cache/GetCacheMiddleware.js';
import { swaggerSpec, swaggerUiMiddleware } from './config/swagger.js';
import { ResponseBuilder } from './utils/responseBuilder.js';

import serviciosRoutes from './v1/routes/servicios.routes.js';
import salonesRoutes from './v1/routes/salones.routes.js';
import turnosRoutes from './v1/routes/turnos.routes.js';
import reservasRoutes from './v1/routes/reservas.routes.js';
import comentariosRoutes from './v1/routes/comentarios.routes.js';
import authRoutes from './v1/routes/auth.routes.js';
import usuariosRoutes from './v1/routes/usuarios.routes.js';
import reportesRoutes from './v1/routes/reportes.routes.js';
import informesRoutes from './v1/routes/informes.routes.js';

const app = express();
const cache = apicache.middleware;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(CacheMiddleware.clear);

const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, 'access.log');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const accessLogStream = fs.createWriteStream(logFile, { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));
app.use(
  '/swagger',
  swaggerUiMiddleware.serve,
  swaggerUiMiddleware.setup(swaggerSpec, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  })
);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/servicios', GetCache('5 minutes'), serviciosRoutes);
app.use('/api/v1/salones', GetCache('5 minutes'), salonesRoutes);
app.use('/api/v1/turnos', GetCache('5 minutes'), turnosRoutes);
app.use('/api/v1/reservas', GetCache('5 minutes'), reservasRoutes);
app.use('/api/v1/comentarios', GetCache('5 minutes'), comentariosRoutes);
app.use('/api/v1/usuarios', GetCache('5 minutes'), usuariosRoutes);
app.use('/api/v1/reportes', GetCache('5 minutes'), reportesRoutes);
app.use('/api/v1/informes', GetCache('5 minutes'), informesRoutes);

app.get('/', (_req, res) =>
  res.json({
    ok: true,
    mensaje: 'API REST - Gestión de Reservas de Cumpleaños',
    version: 'v1',
    autor: 'Grupo M - Programación III - UNER 2025',
  })
);

app.use((err, req, res, next) => ResponseBuilder.handleError(res, err));

export default app;
