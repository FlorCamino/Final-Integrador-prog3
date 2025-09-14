import express from "express";
import rutas from "./routes/index.route.js"; 

const aplicacion = express();

aplicacion.use(express.json());

aplicacion.use("/api", rutas);

export default aplicacion;
