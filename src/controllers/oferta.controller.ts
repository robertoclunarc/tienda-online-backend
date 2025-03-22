import { Request, Response } from 'express';
import { OfertaModel, Oferta, OfertaProducto } from '../models/oferta.model';

export const ofertaController = {
  // Obtener todas las ofertas activas
  getAllActive: async (req: Request, res: Response): Promise<void> => {
    try {
      const ofertas = await OfertaModel.findAllActive();
      res.json(ofertas);
    } catch (error) {
      console.error('Error en getAllActive de ofertaController:', error);
      res.status(500).json({ message: 'Error al obtener ofertas activas' });
    }
  },

  // Obtener todas las ofertas
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const ofertas = await OfertaModel.findAll();
      res.json(ofertas);
    } catch (error) {
      console.error('Error en getAll de ofertaController:', error);
      res.status(500).json({ message: 'Error al obtener ofertas' });
    }
  },

  // Obtener una oferta por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const oferta = await OfertaModel.findById(id);
      
      if (!oferta) {
        res.status(404).json({ message: 'Oferta no encontrada' });
        return;
      }
      
      res.json(oferta);
    } catch (error) {
      console.error(`Error en getById de ofertaController:`, error);
      res.status(500).json({ message: 'Error al obtener la oferta' });
    }
  },

  // Obtener productos de una oferta
  getProductosOferta: async (req: Request, res: Response): Promise<void> => {
    try {
      const ofertaId = parseInt(req.params.id);
      const productos = await OfertaModel.getProductosOferta(ofertaId);
      res.json(productos);
    } catch (error) {
      console.error('Error en getProductosOferta de ofertaController:', error);
      res.status(500).json({ message: 'Error al obtener productos de la oferta' });
    }
  },

  // Crear una nueva oferta
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevaOferta: Oferta = req.body;
      const id = await OfertaModel.create(nuevaOferta);
      res.status(201).json({ id, message: 'Oferta creada correctamente' });
    } catch (error) {
      console.error('Error en create de ofertaController:', error);
      res.status(500).json({ message: 'Error al crear la oferta' });
    }
  },

  // Actualizar una oferta
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const ofertaData: Partial<Oferta> = req.body;
      
      const exitosoUpdate = await OfertaModel.update(id, ofertaData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Oferta no encontrada o no se realizaron cambios' });
        return;
      }
      
      res.json({ message: 'Oferta actualizada correctamente' });
    } catch (error) {
      console.error('Error en update de ofertaController:', error);
      res.status(500).json({ message: 'Error al actualizar la oferta' });
    }
  },

  // Eliminar una oferta (marcar como inactiva)
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await OfertaModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Oferta no encontrada' });
        return;
      }
      
      res.json({ message: 'Oferta eliminada correctamente' });
    } catch (error) {
      console.error('Error en delete de ofertaController:', error);
      res.status(500).json({ message: 'Error al eliminar la oferta' });
    }
  },

  // Añadir producto a una oferta
  addProductoOferta: async (req: Request, res: Response): Promise<void> => {
    try {
      const ofertaProducto: OfertaProducto = req.body;
      const id = await OfertaModel.addProductoOferta(ofertaProducto);
      res.status(201).json({ id, message: 'Producto añadido a la oferta correctamente' });
    } catch (error) {
      console.error('Error en addProductoOferta de ofertaController:', error);
      res.status(500).json({ message: 'Error al añadir producto a la oferta' });
    }
  },

  // Eliminar producto de una oferta
  removeProductoOferta: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await OfertaModel.removeProductoOferta(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Producto de oferta no encontrado' });
        return;
      }
      
      res.json({ message: 'Producto eliminado de la oferta correctamente' });
    } catch (error) {
      console.error('Error en removeProductoOferta de ofertaController:', error);
      res.status(500).json({ message: 'Error al eliminar producto de la oferta' });
    }
  }
};