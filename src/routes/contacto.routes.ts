import { Router } from 'express';
import { contactoController } from '../controllers/contacto.controller';

const router = Router();

// Obtener contactos activos
router.get('/activos', contactoController.getAllActive);

// Rutas CRUD básicas
router.get('/', contactoController.getAll);
router.get('/:id', contactoController.getById);
router.post('/', contactoController.create);
router.put('/:id', contactoController.update);
router.delete('/:id', contactoController.delete);

export default router;