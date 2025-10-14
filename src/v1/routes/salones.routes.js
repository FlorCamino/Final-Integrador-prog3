import express from 'express';
import SalonesController from '../../controllers/salones.controller.js';

const salonesController = new SalonesController();
const router = express.Router();

router.get('/', salonesController.obtenerSalones);
router.get('/:id', salonesController.obtenerSalonPorId);
router.post('/', salonesController.crearSalon);
router.put('/modificar/:salon_id', salonesController.modificarSalon);
router.delete('/eliminar/:salon_id', salonesController.eliminarSalon);

export default router;
