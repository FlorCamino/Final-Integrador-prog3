import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST – Gestión de Reservas de Salones',
      version: '1.0.0',
      description: 'Documentación de la API del proyecto integrador de Programación III (UNER)',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}/api/v1`,
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido tras el inicio de sesión',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    path.join(__dirname, '../docs/*.js'),
    path.join(__dirname, '../v1/routes/*.js'),
    path.join(__dirname, '../docs/reportes.doc.js'),
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerUiMiddleware = swaggerUi;

export function setupSwagger(app) {
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
