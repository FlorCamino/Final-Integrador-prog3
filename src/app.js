import express from 'express';
import serviciosRoutes from './routes/servicios.routes.js';
import { swaggerSpec, swaggerUiMiddleware } from './config/swagger.js';

const app = express();
app.use(express.json());

app.use('/api/v1/servicios', serviciosRoutes);

app.use('/swagger', swaggerUiMiddleware.serve, swaggerUiMiddleware.setup(swaggerSpec));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log(`Swagger docs en http://localhost:${PORT}/swagger`);
});
