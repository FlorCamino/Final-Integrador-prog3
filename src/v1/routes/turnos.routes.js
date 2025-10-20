import express from 'express';
import { verificarToken } from '../../middlewares/auth.js';
import { verificarRol } from '../../middlewares/role.js';
import TurnosController from '../../controllers/turno.controller.js';

const turnosController = new TurnosController();
const router = express.Router();

router.get('/',  
    verificarToken,
    verificarRol('cliente','administrador', 'empleado'),
    turnosController.obtenerTurnos
);

router.get('/:id', 
    verificarToken,
    verificarRol('cliente','administrador', 'empleado'),
    turnosController.obtenerTurnoPorId
);

router.post('/', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    turnosController.crearTurno
);

router.put('/modificar/:id', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    turnosController.modificarTurno
);

router.delete('/eliminar/:id', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    turnosController.eliminarTurno
);

export default router;