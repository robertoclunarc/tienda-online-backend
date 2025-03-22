import { Router } from 'express';
import { ofertaController } from '../controllers/oferta.controller';

const router = Router();

// Obtener ofertas activas
router.get('/activas', ofertaController.getAllActive);

// Obtener productos de una oferta
router.get('/:id/productos', ofertaController.getProductosOferta);

// Añadir producto a una oferta
router.post('/producto', ofertaController.addProductoOferta);

// Eliminar producto de una oferta
router.delete('/producto/:id', ofertaController.removeProductoOferta);

// Rutas CRUD básicas
router.get('/', ofertaController.getAll);
router.get('/:id', ofertaController.getById);
router.post('/', ofertaController.create);
router.put('/:id', ofertaController.update);
router.delete('/:id', ofertaController.delete);

export default router;