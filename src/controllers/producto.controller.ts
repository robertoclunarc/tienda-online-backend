import { Request, Response } from 'express';
import { ProductoModel, Producto } from '../models/producto.model';

export const productoController = {
  // Obtener todos los productos
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const productos = await ProductoModel.findAll();
      res.json(productos);
    } catch (error) {
      console.error('Error en getAll de productoController:', error);
      res.status(500).json({ message: 'Error al obtener productos' });
    }
  },

  // Obtener productos destacados
  getFeatured: async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const productos = await ProductoModel.findFeatured(limit);
      res.json(productos);
    } catch (error) {
      console.error('Error en getFeatured de productoController:', error);
      res.status(500).json({ message: 'Error al obtener productos destacados' });
    }
  },

  // Obtener un producto por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const producto = await ProductoModel.findById(id);
      
      if (!producto) {
        res.status(404).json({ message: 'Producto no encontrado' });
        return;
      }
      
      res.json(producto);
    } catch (error) {
      console.error(`Error en getById de productoController:`, error);
      res.status(500).json({ message: 'Error al obtener el producto' });
    }
  },

  // Obtener productos por categoría
  getByCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const productos = await ProductoModel.findByCategory(categoryId);
      res.json(productos);
    } catch (error) {
      console.error('Error en getByCategory de productoController:', error);
      res.status(500).json({ message: 'Error al obtener productos por categoría' });
    }
  },

  // Obtener productos por subcategoría
  getBySubcategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const subcategoryId = parseInt(req.params.subcategoryId);
      const productos = await ProductoModel.findBySubcategory(subcategoryId);
      res.json(productos);
    } catch (error) {
      console.error('Error en getBySubcategory de productoController:', error);
      res.status(500).json({ message: 'Error al obtener productos por subcategoría' });
    }
  },

  // Crear un nuevo producto
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevoProducto: Producto = req.body;
      const id = await ProductoModel.create(nuevoProducto);
      res.status(201).json({ id, message: 'Producto creado correctamente' });
    } catch (error) {
      console.error('Error en create de productoController:', error);
      res.status(500).json({ message: 'Error al crear el producto' });
    }
  },

  // Actualizar un producto
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const productoData: Partial<Producto> = req.body;
      
      const exitosoUpdate = await ProductoModel.update(id, productoData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Producto no encontrado o no se realizaron cambios' });
        return;
      }
      
      res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
      console.error('Error en update de productoController:', error);
      res.status(500).json({ message: 'Error al actualizar el producto' });
    }
  },

  // Eliminar un producto (marcar como inactivo)
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await ProductoModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Producto no encontrado' });
        return;
      }
      
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error('Error en delete de productoController:', error);
      res.status(500).json({ message: 'Error al eliminar el producto' });
    }
  },

  // Buscar productos
  search: async (req: Request, res: Response): Promise<void> => {
    try {
      const term = req.query.term as string;
      
      if (!term) {
        res.status(400).json({ message: 'Se requiere un término de búsqueda' });
        return;
      }
      
      const productos = await ProductoModel.search(term);
      res.json(productos);
    } catch (error) {
      console.error('Error en search de productoController:', error);
      res.status(500).json({ message: 'Error al buscar productos' });
    }
  }
};