import express from 'express';
import UsuariosController from '../../controllers/usuarios.controller.js';

const usuariosController = new UsuariosController();
const router = express.Router();

router.get('/', usuariosController.obtenerUsuarios);
router.get('/:id', usuariosController.obtenerUsuarioPorId);
router.post('/', usuariosController.crearUsuario);
router.put('/modificar/:id', usuariosController.modificarUsuario);
router.delete('/eliminar/:id', usuariosController.eliminarUsuario);

export default router;

