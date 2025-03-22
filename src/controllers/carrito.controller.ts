import { Request, Response } from 'express';
import { CarritoModel, Carrito } from '../models/carrito.model';

export const carritoController = {
  // Obtener carrito de un usuario
  getByUsuario: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const items = await CarritoModel.findByUsuario(usuarioId);
      const total = await CarritoModel.getTotalCarrito(usuarioId);
      
      res.json({
        items,
        total: total.total,
        cantidadItems: total.cantidadItems
      });
    } catch (error) {
      console.error('Error en getByUsuario de carritoController:', error);
      res.status(500).json({ message: 'Error al obtener carrito del usuario' });
    }
  },

  // Añadir producto al carrito
  addToCart: async (req: Request, res: Response): Promise<void> => {
    try {
      const carritoItem: Carrito = req.body;
      const id = await CarritoModel.addToCart(carritoItem);
      
      res.status(201).json({ 
        id, 
        message: 'Producto añadido al carrito correctamente' 
      });
    } catch (error) {
      console.error('Error en addToCart de carritoController:', error);
      res.status(500).json({ message: 'Error al añadir producto al carrito' });
    }
  },

  // Actualizar cantidad de un producto en el carrito
  updateCartItem: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { cantidad } = req.body;
      
      if (!cantidad || cantidad < 1) {
        res.status(400).json({ message: 'La cantidad debe ser al menos 1' });
        return;
      }
      
      const exitosoUpdate = await CarritoModel.updateCartItem(id, cantidad);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Item de carrito no encontrado' });
        return;
      }
      
      res.json({ message: 'Carrito actualizado correctamente' });
    } catch (error) {
      console.error('Error en updateCartItem de carritoController:', error);
      res.status(500).json({ message: 'Error al actualizar producto en el carrito' });
    }
  },

  // Eliminar un producto del carrito
  removeFromCart: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await CarritoModel.removeFromCart(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Item de carrito no encontrado' });
        return;
      }
      
      res.json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
      console.error('Error en removeFromCart de carritoController:', error);
      res.status(500).json({ message: 'Error al eliminar producto del carrito' });
    }
  },

  // Limpiar todo el carrito
  clearCart: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      await CarritoModel.clearCart(usuarioId);
      
      res.json({ message: 'Carrito limpiado correctamente' });
    } catch (error) {
      console.error('Error en clearCart de carritoController:', error);
      res.status(500).json({ message: 'Error al limpiar el carrito' });
    }
  }
};