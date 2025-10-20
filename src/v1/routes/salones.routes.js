import express from 'express';
import { verificarToken } from '../../middlewares/auth.js';
import { verificarRol } from '../../middlewares/role.js';
import SalonesController from '../../controllers/salones.controller.js';

const salonesController = new SalonesController();
const router = express.Router();

router.get('/', 
    verificarToken, 
    verificarRol('cliente', 'administrador', 'empleado'),
    salonesController.obtenerSalones
);

router.get('/:id', 
    verificarToken,
    verificarRol('cliente', 'administrador', 'empleado'),
    salonesController.obtenerSalonPorId
);

router.post('/', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    salonesController.crearSalon
);

router.put('/modificar/:salon_id', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    salonesController.modificarSalon
);

router.delete('/eliminar/:salon_id', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    salonesController.eliminarSalon
);

export default router;
