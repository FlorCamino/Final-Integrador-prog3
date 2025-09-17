import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Reservas de Salones para Eventos",
      version: "1.0.0",
      description: "Documentación de la API de Reservas"
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1",
      }
    ]
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export const swaggerUiMiddleware = swaggerUi;
