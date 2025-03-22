import { Router } from 'express';
import { marcaController } from '../controllers/marca.controller';

const router = Router();

// Obtener modelos de una marca
router.get('/:id/modelos', marcaController.getModelos);

// Rutas CRUD básicas
router.get('/', marcaController.getAll);
router.get('/:id', marcaController.getById);
router.post('/', marcaController.create);
router.put('/:id', marcaController.update);
router.delete('/:id', marcaController.delete);

export default router;