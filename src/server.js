import app from './app.js';
import { initDatabase } from './config/initDB.js';

process.loadEnvFile();
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en: http://localhost:${PORT}`);
      console.log(`Documentación Swagger: http://localhost:${PORT}/swagger`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
})();
