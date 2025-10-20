import express from 'express';
import { verificarToken } from '../../middlewares/auth.js';
import { verificarRol } from '../../middlewares/role.js';
import ServiciosController from '../../controllers/servicios.controller.js';

const serviciosController = new ServiciosController();

const router = express.Router();

router.get('/', 
    verificarToken, 
    verificarRol('cliente', 'administrador', 'empleado'),
    serviciosController.obtenerServicios
);

router.get('/:id', 
    verificarToken,
    verificarRol('cliente', 'administrador', 'empleado'),
    serviciosController.obtenerServicioPorId
);

router.put('/modificar/:servicio_id', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    serviciosController.modificarServicio
);

router.post('/', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    serviciosController.crearServicio
);

router.delete('/eliminar/:servicio_id', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    serviciosController.eliminarServicio
);

export default router;

