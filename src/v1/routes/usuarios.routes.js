import express from 'express';
import { verificarToken } from '../../middlewares/auth.js';
import { verificarRol } from '../../middlewares/role.js';
import UsuariosController from '../../controllers/usuarios.controller.js';
import { validarCreacionUsuario, validarActualizacionUsuario } from '../../middlewares/usuarios.validator.js';

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
    verificarRol('administrador'), validarCreacionUsuario,
    usuariosController.crearUsuario
);

router.put('/:id', 
    verificarToken,
    verificarRol('administrador'), validarActualizacionUsuario,
    usuariosController.modificarUsuario
);

router.delete('/:id', 
    verificarToken,
    verificarRol('administrador'),
    usuariosController.eliminarUsuario
);

export default router;

