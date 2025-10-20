import express from 'express';
import apicache from 'apicache';
import clearCache from './middlewares/clear.cache.js';

import v1ServiciosRoutes from './v1/routes/servicios.routes.js';
import salonesRoutes from './v1/routes/salones.routes.js';
import turnosRoutes from './v1/routes/turnos.routes.js';
import comentariosRoutes from './v1/routes/comentarios.routes.js';

import { swaggerSpec, swaggerUiMiddleware } from './config/swagger.js';

const app = express();
const cache = apicache.middleware;


app.use(express.json());
app.use(clearCache);


app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));
app.use('/swagger', swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));


app.use('/api/v1/servicios', cache('5 minutes'), v1ServiciosRoutes);
app.use('/api/v1/salones', cache('5 minutes'), salonesRoutes);
app.use('/api/v1/turnos', cache('5 minutes'), turnosRoutes);
app.use('/api/v1/comentarios',cache('5 minutes'), comentariosRoutes);

app.use((err, req, res, next) => {
  console.error('Error inesperado:', err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

export default app;