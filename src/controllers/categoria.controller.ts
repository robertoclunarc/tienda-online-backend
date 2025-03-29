import { Request, Response } from 'express';
import { CategoriaModel, Categoria } from '../models/categoria.model';

export const categoriaController = {
  // Obtener todas las categorías
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const categorias = await CategoriaModel.findAll();
      res.json(categorias);
    } catch (error) {
      console.error('Error en getAll de categoriaController:', error);
      res.status(500).json({ message: 'Error al obtener categorías' });
    }
  },

  // Obtener una categoría por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const categoria = await CategoriaModel.findById(id);
      
      if (!categoria) {
        res.status(404).json({ message: 'Categoría no encontrada' });
        return;
      }
      
      res.json(categoria);
    } catch (error) {
      console.error(`Error en getById de categoriaController:`, error);
      res.status(500).json({ message: 'Error al obtener la categoría' });
    }
  },

  // Obtener subcategorías por categoría
  getSubcategorias: async (req: Request, res: Response): Promise<void> => {
    try {
      const categoriaId = parseInt(req.params.id);
      const subcategorias = await CategoriaModel.getsubcategorias(categoriaId);
      res.json(subcategorias);
    } catch (error) {
      console.error('Error en getSubcategorias de categoriaController:', error);
      res.status(500).json({ message: 'Error al obtener subcategorías' });
    }
  },

  // Crear una nueva categoría
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevaCategoria: Categoria = req.body;
      const id = await CategoriaModel.create(nuevaCategoria);
      res.status(201).json({ id, message: 'Categoría creada correctamente' });
    } catch (error) {
      console.error('Error en create de categoriaController:', error);
      res.status(500).json({ message: 'Error al crear la categoría' });
    }
  },

  // Actualizar una categoría
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const categoriaData: Categoria = req.body;
      
      const exitosoUpdate = await CategoriaModel.update(id, categoriaData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Categoría no encontrada' });
        return;
      }
      
      res.json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
      console.error('Error en update de categoriaController:', error);
      res.status(500).json({ message: 'Error al actualizar la categoría' });
    }
  },

  // Eliminar una categoría
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await CategoriaModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Categoría no encontrada' });
        return;
      }
      
      res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
      console.error('Error en delete de categoriaController:', error);
      res.status(500).json({ message: 'Error al eliminar la categoría' });
    }
  }
};