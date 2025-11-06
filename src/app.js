import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import passport from 'passport';

import PassportConfig from './config/passportConfig.js';
import { CacheMiddleware } from './middlewares/cache/CacheMiddleware.js';
import { swaggerSpec, swaggerUiMiddleware } from './config/swaggerConfig.js';
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use(CacheMiddleware.clear);

const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, 'access.log');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const accessLogStream = fs.createWriteStream(logFile, { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

const passportConfig = new PassportConfig(passport);
passportConfig.initialize();
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
app.use('/api/v1/servicios', serviciosRoutes);
app.use('/api/v1/salones', salonesRoutes);
app.use('/api/v1/turnos', turnosRoutes);
app.use('/api/v1/reservas', reservasRoutes);
app.use('/api/v1/comentarios', comentariosRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/reportes', reportesRoutes);
app.use('/api/v1/informes', informesRoutes);

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
