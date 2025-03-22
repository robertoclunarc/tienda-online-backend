import { Request, Response } from 'express';
import { TiendaModel, Tienda, TiendaProducto } from '../models/tienda.model';

export const tiendaController = {
  // Obtener todas las tiendas activas
  getAllActive: async (req: Request, res: Response): Promise<void> => {
    try {
      const tiendas = await TiendaModel.findAllActive();
      res.json(tiendas);
    } catch (error) {
      console.error('Error en getAllActive de tiendaController:', error);
      res.status(500).json({ message: 'Error al obtener tiendas activas' });
    }
  },

  // Obtener todas las tiendas
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const tiendas = await TiendaModel.findAll();
      res.json(tiendas);
    } catch (error) {
      console.error('Error en getAll de tiendaController:', error);
      res.status(500).json({ message: 'Error al obtener tiendas' });
    }
  },

  // Obtener una tienda por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const tienda = await TiendaModel.findById(id);
      
      if (!tienda) {
        res.status(404).json({ message: 'Tienda no encontrada' });
        return;
      }
      
      res.json(tienda);
    } catch (error) {
      console.error(`Error en getById de tiendaController:`, error);
      res.status(500).json({ message: 'Error al obtener la tienda' });
    }
  },

  // Obtener productos de una tienda
  getProductosTienda: async (req: Request, res: Response): Promise<void> => {
    try {
      const tiendaId = parseInt(req.params.id);
      const productos = await TiendaModel.getProductosTienda(tiendaId);
      res.json(productos);
    } catch (error) {
      console.error('Error en getProductosTienda de tiendaController:', error);
      res.status(500).json({ message: 'Error al obtener productos de la tienda' });
    }
  },

  // Crear una nueva tienda
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevaTienda: Tienda = req.body;
      const id = await TiendaModel.create(nuevaTienda);
      res.status(201).json({ id, message: 'Tienda creada correctamente' });
    } catch (error) {
      console.error('Error en create de tiendaController:', error);
      res.status(500).json({ message: 'Error al crear la tienda' });
    }
  },

  // Actualizar una tienda
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const tiendaData: Partial<Tienda> = req.body;
      
      const exitosoUpdate = await TiendaModel.update(id, tiendaData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Tienda no encontrada o no se realizaron cambios' });
        return;
      }
      
      res.json({ message: 'Tienda actualizada correctamente' });
    } catch (error) {
      console.error('Error en update de tiendaController:', error);
      res.status(500).json({ message: 'Error al actualizar la tienda' });
    }
  },

  // Eliminar una tienda (cambiar estatus a INACTIVO)
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await TiendaModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Tienda no encontrada' });
        return;
      }
      
      res.json({ message: 'Tienda eliminada correctamente' });
    } catch (error) {
      console.error('Error en delete de tiendaController:', error);
      res.status(500).json({ message: 'Error al eliminar la tienda' });
    }
  },

  // Añadir producto a una tienda
  addProductoTienda: async (req: Request, res: Response): Promise<void> => {
    try {
      const tiendaProducto: TiendaProducto = req.body;
      const id = await TiendaModel.addProductoTienda(tiendaProducto);
      
      res.status(201).json({ 
        id, 
        message: 'Producto añadido a la tienda correctamente' 
      });
    } catch (error) {
      console.error('Error en addProductoTienda de tiendaController:', error);
      res.status(500).json({ message: 'Error al añadir producto a la tienda' });
    }
  },

  // Actualizar producto en una tienda
  updateProductoTienda: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { cantidad, precio } = req.body;
      
      if (!cantidad || !precio) {
        res.status(400).json({ message: 'Se requiere cantidad y precio' });
        return;
      }
      
      const exitosoUpdate = await TiendaModel.updateProductoTienda(id, cantidad, precio);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Producto de tienda no encontrado' });
        return;
      }
      
      res.json({ message: 'Producto de tienda actualizado correctamente' });
    } catch (error) {
      console.error('Error en updateProductoTienda de tiendaController:', error);
      res.status(500).json({ message: 'Error al actualizar producto en la tienda' });
    }
  },

  // Eliminar un producto de una tienda
  removeProductoTienda: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await TiendaModel.removeProductoTienda(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Producto de tienda no encontrado' });
        return;
      }
      
      res.json({ message: 'Producto eliminado de la tienda correctamente' });
    } catch (error) {
      console.error('Error en removeProductoTienda de tiendaController:', error);
      res.status(500).json({ message: 'Error al eliminar producto de la tienda' });
    }
  }
};