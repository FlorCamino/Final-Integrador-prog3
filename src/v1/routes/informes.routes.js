import { Router } from 'express';
import { obtenerEstadisticas } from '../../controllers/informes.controller.js';

const router = Router();

router.get('/estadisticas', obtenerEstadisticas);

export default router;
