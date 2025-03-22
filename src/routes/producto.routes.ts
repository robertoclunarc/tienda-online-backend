import { Router } from 'express';
import { productoController } from '../controllers/producto.controller';

const router = Router();

// Obtener productos destacados
router.get('/destacados', productoController.getFeatured);

// Buscar productos
router.get('/buscar', productoController.search);

// Obtener productos por categoría
router.get('/categoria/:categoryId', productoController.getByCategory);

// Obtener productos por subcategoría
router.get('/subcategoria/:subcategoryId', productoController.getBySubcategory);

// Rutas CRUD básicas
router.get('/', productoController.getAll);
router.get('/:id', productoController.getById);
router.post('/', productoController.create);
router.put('/:id', productoController.update);
router.delete('/:id', productoController.delete);

export default router;