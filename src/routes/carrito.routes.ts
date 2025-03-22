import { Router } from 'express';
import { carritoController } from '../controllers/carrito.controller';

const router = Router();

// Obtener carrito de un usuario
router.get('/usuario/:usuarioId', carritoController.getByUsuario);

// Limpiar carrito de un usuario
router.delete('/usuario/:usuarioId/clear', carritoController.clearCart);

// Añadir producto al carrito
router.post('/', carritoController.addToCart);

// Actualizar cantidad de un producto
router.put('/:id', carritoController.updateCartItem);

// Eliminar un producto del carrito
router.delete('/:id', carritoController.removeFromCart);

export default router;