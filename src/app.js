import express from 'express';
import apicache from 'apicache';

import { setupSwagger } from './config/swagger.js';
import { CacheMiddleware } from './middlewares/cache/CacheMiddleware.js';

import serviciosRoutes from './v1/routes/servicios.routes.js';
import salonesRoutes from './v1/routes/salones.routes.js';
import turnosRoutes from './v1/routes/turnos.routes.js';
import comentariosRoutes from './v1/routes/comentarios.routes.js';
import authRoutes from './v1/routes/auth.routes.js';
import usuariosRoutes from './v1/routes/usuarios.routes.js';
import reportesRoutes from './v1/routes/reportes.routes.js';

const app = express();
const cache = apicache.middleware;

app.use(express.json());

app.use(CacheMiddleware.clear);

setupSwagger(app);

app.use('/api/v1/servicios', cache('5 minutes'), serviciosRoutes);
app.use('/api/v1/salones', cache('5 minutes'), salonesRoutes);
app.use('/api/v1/turnos', cache('5 minutes'), turnosRoutes);
app.use('/api/v1/comentarios', cache('5 minutes'), comentariosRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', cache('5 minutes'), usuariosRoutes);
app.use('/api/v1/reportes', reportesRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Error inesperado:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;
