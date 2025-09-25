import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Servicios',
      version: '1.0.0',
      description: 'Documentación de la API de Servicios',
    },
    servers: [
      {
        url: 'http://localhost:4000/api/v1',
        description: 'Servidor local',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
export const swaggerUiMiddleware = swaggerUi;

