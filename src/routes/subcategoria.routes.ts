import { Router } from 'express';
import { subcategoriaController } from '../controllers/subcategoria.controller';

const router = Router();

// Obtener subcategorías por categoría
router.get('/categoria/:categoriaId', subcategoriaController.getByCategoria);

// Rutas CRUD básicas
router.get('/', subcategoriaController.getAll);
router.get('/:id', subcategoriaController.getById);
router.post('/', subcategoriaController.create);
router.put('/:id', subcategoriaController.update);
router.delete('/:id', subcategoriaController.delete);

export default router;