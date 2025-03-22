import { Router } from 'express';
import { ventaController } from '../controllers/venta.controller';

const router = Router();

// Obtener estadísticas de ventas
router.get('/estadisticas', ventaController.getEstadisticas);

// Obtener ventas de un usuario
router.get('/usuario/:usuarioId', ventaController.getByUsuario);

// Rutas CRUD básicas
router.get('/', ventaController.getAll);
router.get('/:id', ventaController.getById);
router.post('/', ventaController.create);
router.put('/:id/estatus', ventaController.updateEstatus);

export default router;