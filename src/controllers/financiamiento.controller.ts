import { Request, Response } from 'express';
import { FinanciamientoModel, Financiamiento } from '../models/financiamiento.model';

export const financiamientoController = {
  // Obtener todos los financiamientos activos
  getAllActive: async (req: Request, res: Response): Promise<void> => {
    try {
      const financiamientos = await FinanciamientoModel.findAllActive();
      res.json(financiamientos);
    } catch (error) {
      console.error('Error en getAllActive de financiamientoController:', error);
      res.status(500).json({ message: 'Error al obtener financiamientos activos' });
    }
  },

  // Obtener todos los financiamientos
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const financiamientos = await FinanciamientoModel.findAll();
      res.json(financiamientos);
    } catch (error) {
      console.error('Error en getAll de financiamientoController:', error);
      res.status(500).json({ message: 'Error al obtener financiamientos' });
    }
  },

  // Obtener un financiamiento por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const financiamiento = await FinanciamientoModel.findById(id);
      
      if (!financiamiento) {
        res.status(404).json({ message: 'Financiamiento no encontrado' });
        return;
      }
      
      res.json(financiamiento);
    } catch (error) {
      console.error(`Error en getById de financiamientoController:`, error);
      res.status(500).json({ message: 'Error al obtener el financiamiento' });
    }
  },

  // Crear un nuevo financiamiento
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevoFinanciamiento: Financiamiento = req.body;
      const id = await FinanciamientoModel.create(nuevoFinanciamiento);
      res.status(201).json({ id, message: 'Financiamiento creado correctamente' });
    } catch (error) {
      console.error('Error en create de financiamientoController:', error);
      res.status(500).json({ message: 'Error al crear el financiamiento' });
    }
  },

  // Actualizar un financiamiento
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const financiamientoData: Partial<Financiamiento> = req.body;
      
      const exitosoUpdate = await FinanciamientoModel.update(id, financiamientoData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Financiamiento no encontrado o no se realizaron cambios' });
        return;
      }
      
      res.json({ message: 'Financiamiento actualizado correctamente' });
    } catch (error) {
      console.error('Error en update de financiamientoController:', error);
      res.status(500).json({ message: 'Error al actualizar el financiamiento' });
    }
  },

  // Eliminar un financiamiento (cambiar estatus a INACTIVO)
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await FinanciamientoModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Financiamiento no encontrado' });
        return;
      }
      
      res.json({ message: 'Financiamiento eliminado correctamente' });
    } catch (error) {
      console.error('Error en delete de financiamientoController:', error);
      res.status(500).json({ message: 'Error al eliminar el financiamiento' });
    }
  }
};