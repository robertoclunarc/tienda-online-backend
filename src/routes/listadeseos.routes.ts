import { Router } from 'express';
import { listaDeseosController } from '../controllers/listadeseos.controller';

const router = Router();

// Obtener lista de deseos de un usuario
router.get('/usuario/:usuarioId', listaDeseosController.getByUsuario);

// Limpiar lista de deseos de un usuario
router.delete('/usuario/:usuarioId/clear', listaDeseosController.clearWishlist);

// Eliminar un producto específico de la lista de deseos de un usuario
router.delete('/usuario/:usuarioId/producto/:productoId', listaDeseosController.removeProductFromWishlist);

// Añadir producto a la lista de deseos
router.post('/', listaDeseosController.addToWishlist);

// Eliminar un producto de la lista de deseos
router.delete('/:id', listaDeseosController.removeFromWishlist);

export default router;