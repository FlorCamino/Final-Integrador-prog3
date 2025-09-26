import express from 'express';
import v1ServiciosRoutes from './v1/routes/servicios.routes.js';
import { swaggerSpec, swaggerUiMiddleware } from './config/swagger.js';

const app = express();

app.use(express.json());

app.get('/swagger.json', (_req, res) => res.json(swaggerSpec));
app.use('/swagger', swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

app.use('/api/v1/servicios', v1ServiciosRoutes);

export default app;
