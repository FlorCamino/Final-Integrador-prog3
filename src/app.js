import express from "express";
import { swaggerUi, swaggerSpec } from "./docs/swagger.js";
import rutas from "./routes/index.route.js"; 

const aplicacion = express();

aplicacion.use(express.json());

aplicacion.use("/api", rutas);
aplicacion.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default aplicacion;
