import { generarInforme } from '../services/informes.service.js';

export async function obtenerEstadisticas(req, res) {
  try {
    const resultados = await generarInforme();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
