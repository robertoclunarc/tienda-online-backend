import { Request, Response } from 'express';
import { SubcategoriaModel, Subcategoria } from '../models/subcategoria.model';

export const subcategoriaController = {
  // Obtener todas las subcategorías
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const subcategorias = await SubcategoriaModel.findAll();
      res.json(subcategorias);
    } catch (error) {
      console.error('Error en getAll de subcategoriaController:', error);
      res.status(500).json({ message: 'Error al obtener subcategorías' });
    }
  },

  // Obtener subcategorías por categoría
  getByCategoria: async (req: Request, res: Response): Promise<void> => {
    try {
      const categoriaId = parseInt(req.params.categoriaId);
      const subcategorias = await SubcategoriaModel.findByCategoria(categoriaId);
      res.json(subcategorias);
    } catch (error) {
      console.error('Error en getByCategoria de subcategoriaController:', error);
      res.status(500).json({ message: 'Error al obtener subcategorías por categoría' });
    }
  },

  // Obtener una subcategoría por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const subcategoria = await SubcategoriaModel.findById(id);
      
      if (!subcategoria) {
        res.status(404).json({ message: 'Subcategoría no encontrada' });
        return;
      }
      
      res.json(subcategoria);
    } catch (error) {
      console.error(`Error en getById de subcategoriaController:`, error);
      res.status(500).json({ message: 'Error al obtener la subcategoría' });
    }
  },

  // Crear una nueva subcategoría
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevaSubcategoria: Subcategoria = req.body;
      const id = await SubcategoriaModel.create(nuevaSubcategoria);
      res.status(201).json({ id, message: 'Subcategoría creada correctamente' });
    } catch (error) {
      console.error('Error en create de subcategoriaController:', error);
      res.status(500).json({ message: 'Error al crear la subcategoría' });
    }
  },

  // Actualizar una subcategoría
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const subcategoriaData: Subcategoria = req.body;
      
      const exitosoUpdate = await SubcategoriaModel.update(id, subcategoriaData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Subcategoría no encontrada' });
        return;
      }
      
      res.json({ message: 'Subcategoría actualizada correctamente' });
    } catch (error) {
      console.error('Error en update de subcategoriaController:', error);
      res.status(500).json({ message: 'Error al actualizar la subcategoría' });
    }
  },

  // Eliminar una subcategoría
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await SubcategoriaModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Subcategoría no encontrada' });
        return;
      }
      
      res.json({ message: 'Subcategoría eliminada correctamente' });
    } catch (error) {
      console.error('Error en delete de subcategoriaController:', error);
      res.status(500).json({ message: 'Error al eliminar la subcategoría' });
    }
  }
};