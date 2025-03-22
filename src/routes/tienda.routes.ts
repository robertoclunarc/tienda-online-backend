import { Router } from 'express';
import { tiendaController } from '../controllers/tienda.controller';

const router = Router();

// Obtener tiendas activas
router.get('/activas', tiendaController.getAllActive);

// Obtener productos de una tienda
router.get('/:id/productos', tiendaController.getProductosTienda);

// Rutas para productos de tiendas
router.post('/producto', tiendaController.addProductoTienda);
router.put('/producto/:id', tiendaController.updateProductoTienda);
router.delete('/producto/:id', tiendaController.removeProductoTienda);

// Rutas CRUD básicas para tiendas
router.get('/', tiendaController.getAll);
router.get('/:id', tiendaController.getById);
router.post('/', tiendaController.create);
router.put('/:id', tiendaController.update);
router.delete('/:id', tiendaController.delete);

export default router;