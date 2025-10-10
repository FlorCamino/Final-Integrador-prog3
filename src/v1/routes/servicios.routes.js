import express from 'express';
import ServiciosController from '../../controllers/servicios.controller.js';

const serviciosController = new ServiciosController();

const router = express.Router();

router.get('/', serviciosController.obtenerServicios);
router.get('/:id', serviciosController.obtenerServicioPorId);
router.put('/modificar/:servicio_id', serviciosController.modificarServicio)
router.post('/', serviciosController.crearServicio);
router.delete('/eliminar/:servicio_id', serviciosController.eliminarServicio);

export default router;

