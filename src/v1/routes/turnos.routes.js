import express from 'express';
import TurnosController from '../../controllers/turno.controller.js';

const turnosController = new TurnosController();
const router = express.Router();

router.get('/', turnosController.obtenerTurnos);
router.get('/:id', turnosController.obtenerTurnoPorId);
router.post('/', turnosController.crearTurno);
router.put('/modificar/:id', turnosController.modificarTurno);
router.delete('/eliminar/:id', turnosController.eliminarTurno);

export default router;