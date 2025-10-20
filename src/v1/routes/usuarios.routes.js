import express from 'express';
import { verificarToken } from '../../middlewares/auth.js';
import { verificarRol } from '../../middlewares/role.js';
import UsuariosController from '../../controllers/usuarios.controller.js';

const usuariosController = new UsuariosController();
const router = express.Router();

router.get('/', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    usuariosController.obtenerUsuarios
);

router.get('/:id', 
    verificarToken,
    verificarRol('administrador', 'empleado'),
    usuariosController.obtenerUsuarioPorId
);

router.post('/', 
    verificarToken,
    verificarRol('administrador'),
    usuariosController.crearUsuario
);

router.put('/modificar/:id', 
    verificarToken,
    verificarRol('administrador'),
    usuariosController.modificarUsuario
);

router.delete('/eliminar/:id', 
    verificarToken,
    verificarRol('administrador'),
    usuariosController.eliminarUsuario
);

export default router;

