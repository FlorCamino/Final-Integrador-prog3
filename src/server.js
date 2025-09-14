import aplicacion from "./app.js";
import conexionBaseDatos from "./config/db.js";

const PUERTO = process.env.PUERTO || 3000;

const servidor = aplicacion.listen(PUERTO, () => {
  console.log(`API corriendo en http://localhost:${PUERTO}/api/docs`);
});

function cerrarServidorYBaseDeDatos() {
  console.log("Cerrando conexiones a la base de datos");

  conexionBaseDatos.end()
    .then(() => {
      servidor.close(() => {
        console.log("Servidor detenido correctamente");
        process.exit(0);
      });
    })
    .catch((error) => {
      console.error("Error al cerrar la base de datos:", error);
      process.exit(1);
    });
}

process.on("SIGINT", cerrarServidorYBaseDeDatos);

