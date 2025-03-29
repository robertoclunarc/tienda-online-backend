import { Request, Response } from 'express';
import { ListaDeseosModel, ListaDeseos } from '../models/listadeseos.model';

export const listaDeseosController = {
  // Obtener lista de deseos de un usuario
  getByUsuario: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const items = await ListaDeseosModel.findByUsuario(usuarioId);
      
      res.json(items);
    } catch (error) {
      console.error('Error en getByUsuario de listaDeseosController:', error);
      res.status(500).json({ message: 'Error al obtener lista de deseos del usuario' });
    }
  },

  // Añadir producto a la lista de deseos
  addToWishlist: async (req: Request, res: Response): Promise<void> => {
    try {
      const listaDeseos: ListaDeseos = req.body;
      
      // Verificar si ya existe
      const existe = await ListaDeseosModel.existsInWishlist(listaDeseos.fkcuentauser, listaDeseos.fkproducto);
      if (existe) {
        res.status(400).json({ message: 'El producto ya está en la lista de deseos' });
        return;
      }
      
      const id = await ListaDeseosModel.addToWishlist(listaDeseos);
      
      res.status(201).json({ 
        id, 
        message: 'Producto añadido a la lista de deseos correctamente' 
      });
    } catch (error) {
      console.error('Error en addToWishlist de listaDeseosController:', error);
      res.status(500).json({ message: 'Error al añadir producto a la lista de deseos' });
    }
  },

  // Eliminar un producto de la lista de deseos
  removeFromWishlist: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await ListaDeseosModel.removeFromWishlist(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Item de lista de deseos no encontrado' });
        return;
      }
      
      res.json({ message: 'Producto eliminado de la lista de deseos correctamente' });
    } catch (error) {
      console.error('Error en removeFromWishlist de listaDeseosController:', error);
      res.status(500).json({ message: 'Error al eliminar producto de la lista de deseos' });
    }
  },

  // Eliminar un producto específico de la lista de deseos de un usuario
  removeProductFromWishlist: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const productoId = parseInt(req.params.productoId);
      
      const exitosoDelete = await ListaDeseosModel.removeProductFromWishlist(usuarioId, productoId);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Producto no encontrado en la lista de deseos' });
        return;
      }
      
      res.json({ message: 'Producto eliminado de la lista de deseos correctamente' });
    } catch (error) {
      console.error('Error en removeProductFromWishlist de listaDeseosController:', error);
      res.status(500).json({ message: 'Error al eliminar producto de la lista de deseos' });
    }
  },

  // Limpiar toda la lista de deseos
  clearWishlist: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      await ListaDeseosModel.clearWishlist(usuarioId);
      
      res.json({ message: 'Lista de deseos limpiada correctamente' });
    } catch (error) {
      console.error('Error en clearWishlist de listaDeseosController:', error);
      res.status(500).json({ message: 'Error al limpiar la lista de deseos' });
    }
  }
};