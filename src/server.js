import dotenv from 'dotenv';
import app from './app.js';
import { initDatabase } from './config/initDB.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

await initDatabase();

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log(`Swagger docs en http://localhost:${PORT}/swagger`);
});
