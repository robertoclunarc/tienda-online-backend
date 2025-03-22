import { Request, Response } from 'express';
import { VentaModel, Venta, DetalleVenta } from '../models/venta.model';
import { CarritoModel } from '../models/carrito.model';

export const ventaController = {
  // Obtener todas las ventas
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const ventas = await VentaModel.findAll();
      res.json(ventas);
    } catch (error) {
      console.error('Error en getAll de ventaController:', error);
      res.status(500).json({ message: 'Error al obtener ventas' });
    }
  },

  // Obtener una venta por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const venta = await VentaModel.findById(id);
      
      if (!venta) {
        res.status(404).json({ message: 'Venta no encontrada' });
        return;
      }
      
      res.json(venta);
    } catch (error) {
      console.error(`Error en getById de ventaController:`, error);
      res.status(500).json({ message: 'Error al obtener la venta' });
    }
  },

  // Obtener ventas de un usuario
  getByUsuario: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarioId = parseInt(req.params.usuarioId);
      const ventas = await VentaModel.findByUsuario(usuarioId);
      res.json(ventas);
    } catch (error) {
      console.error('Error en getByUsuario de ventaController:', error);
      res.status(500).json({ message: 'Error al obtener ventas del usuario' });
    }
  },

  // Crear una nueva venta
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { venta, detalles } = req.body;
      
      // Validar que haya productos
      if (!detalles || detalles.length === 0) {
        res.status(400).json({ message: 'No hay productos en la venta' });
        return;
      }
      
      const id = await VentaModel.create(venta, detalles);
      
      // Si se creó la venta, limpiar el carrito
      if (id && venta.fkCuentaUser) {
        await CarritoModel.clearCart(venta.fkCuentaUser);
      }
      
      res.status(201).json({ id, message: 'Venta creada correctamente' });
    } catch (error) {
      console.error('Error en create de ventaController:', error);
      res.status(500).json({ message: 'Error al crear la venta' });
    }
  },

  // Actualizar estatus de una venta
  updateEstatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { estatus } = req.body;
      
      if (!estatus) {
        res.status(400).json({ message: 'Se requiere el estatus' });
        return;
      }
      
      const exitosoUpdate = await VentaModel.updateEstatus(id, estatus);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Venta no encontrada' });
        return;
      }
      
      res.json({ message: 'Estatus de venta actualizado correctamente' });
    } catch (error) {
      console.error('Error en updateEstatus de ventaController:', error);
      res.status(500).json({ message: 'Error al actualizar estatus de la venta' });
    }
  },

  // Obtener estadísticas de ventas
  getEstadisticas: async (req: Request, res: Response): Promise<void> => {
    try {
      const estadisticas = await VentaModel.getEstadisticas();
      res.json(estadisticas);
    } catch (error) {
      console.error('Error en getEstadisticas de ventaController:', error);
      res.status(500).json({ message: 'Error al obtener estadísticas de ventas' });
    }
  }
};