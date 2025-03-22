import { Router } from 'express';
import { financiamientoController } from '../controllers/financiamiento.controller';

const router = Router();

// Obtener financiamientos activos
router.get('/activos', financiamientoController.getAllActive);

// Rutas CRUD básicas
router.get('/', financiamientoController.getAll);
router.get('/:id', financiamientoController.getById);
router.post('/', financiamientoController.create);
router.put('/:id', financiamientoController.update);
router.delete('/:id', financiamientoController.delete);

export default router;