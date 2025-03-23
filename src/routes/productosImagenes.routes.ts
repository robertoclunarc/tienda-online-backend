import { Router } from 'express';
import { productosImagenesController } from '../controllers/productosImagenes.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Rutas públicas
router.get('/producto/:productoId', productosImagenesController.getByProductId);
router.get('/producto/:productoId/principal', productosImagenesController.getMainImageByProductId);
router.get('/producto/:productoId/miniaturas', productosImagenesController.getThumbnailsByProductId);
router.get('/:id', productosImagenesController.getById);

// Rutas protegidas - solo para administradores
router.post('/', authMiddleware.verifyToken, authMiddleware.verifyAdmin, productosImagenesController.create);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.verifyAdmin, productosImagenesController.update);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.verifyAdmin, productosImagenesController.delete);

export default router;