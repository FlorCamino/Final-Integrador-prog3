import express from 'express';
import apicache from 'apicache';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import passport from 'passport';
import { estrategia, validacion } from './config/passport.js';
import { CacheMiddleware } from './middlewares/cache/CacheMiddleware.js';

import serviciosRoutes from './v1/routes/servicios.routes.js';
import salonesRoutes from './v1/routes/salones.routes.js';
import turnosRoutes from './v1/routes/turnos.routes.js';
import comentariosRoutes from './v1/routes/comentarios.routes.js';
import authRoutes from './v1/routes/auth.routes.js';
import usuariosRoutes from './v1/routes/usuarios.routes.js';
import reportesRoutes from './v1/routes/reportes.routes.js'; 


import { swaggerSpec, swaggerUiMiddleware } from './config/swagger.js';

const app = express();
app.use(express.json());

const cache = apicache.middleware;
app.use(CacheMiddleware.clear);

const logDir = path.join(process.cwd(), 'logs');
const logFile = path.join(logDir, 'access.log');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const accessLogStream = fs.createWriteStream(logFile, { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));
app.use('/swagger', swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

app.use('/api/v1/servicios', cache('5 minutes'), serviciosRoutes);
app.use('/api/v1/salones', cache('5 minutes'), salonesRoutes);
app.use('/api/v1/turnos', cache('5 minutes'), turnosRoutes);
app.use('/api/v1/comentarios', cache('5 minutes'), comentariosRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', cache('5 minutes'), usuariosRoutes);
app.use('/api/v1/reportes', cache('5 minutes'), reportesRoutes); 


app.use((err, req, res, next) => {
  console.error('Error inesperado:', err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

export default app;
