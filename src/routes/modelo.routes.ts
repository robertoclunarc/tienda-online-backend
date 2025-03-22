import { Router } from 'express';
import { modeloController } from '../controllers/modelo.controller';

const router = Router();

// Obtener modelos por marca
router.get('/marca/:marcaId', modeloController.getByMarca);

// Rutas CRUD básicas
router.get('/', modeloController.getAll);
router.get('/:id', modeloController.getById);
router.post('/', modeloController.create);
router.put('/:id', modeloController.update);
router.delete('/:id', modeloController.delete);

export default router;