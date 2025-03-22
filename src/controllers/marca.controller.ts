import { Request, Response } from 'express';
import { MarcaModel, Marca } from '../models/marca.model';

export const marcaController = {
  // Obtener todas las marcas
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const marcas = await MarcaModel.findAll();
      res.json(marcas);
    } catch (error) {
      console.error('Error en getAll de marcaController:', error);
      res.status(500).json({ message: 'Error al obtener marcas' });
    }
  },

  // Obtener una marca por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const marca = await MarcaModel.findById(id);
      
      if (!marca) {
        res.status(404).json({ message: 'Marca no encontrada' });
        return;
      }
      
      res.json(marca);
    } catch (error) {
      console.error(`Error en getById de marcaController:`, error);
      res.status(500).json({ message: 'Error al obtener la marca' });
    }
  },

  // Obtener modelos por marca
  getModelos: async (req: Request, res: Response): Promise<void> => {
    try {
      const marcaId = parseInt(req.params.id);
      const modelos = await MarcaModel.getModelos(marcaId);
      res.json(modelos);
    } catch (error) {
      console.error('Error en getModelos de marcaController:', error);
      res.status(500).json({ message: 'Error al obtener modelos' });
    }
  },

  // Crear una nueva marca
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevaMarca: Marca = req.body;
      const id = await MarcaModel.create(nuevaMarca);
      res.status(201).json({ id, message: 'Marca creada correctamente' });
    } catch (error) {
      console.error('Error en create de marcaController:', error);
      res.status(500).json({ message: 'Error al crear la marca' });
    }
  },

  // Actualizar una marca
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const marcaData: Marca = req.body;
      
      const exitosoUpdate = await MarcaModel.update(id, marcaData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Marca no encontrada' });
        return;
      }
      
      res.json({ message: 'Marca actualizada correctamente' });
    } catch (error) {
      console.error('Error en update de marcaController:', error);
      res.status(500).json({ message: 'Error al actualizar la marca' });
    }
  },

  // Eliminar una marca
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await MarcaModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Marca no encontrada' });
        return;
      }
      
      res.json({ message: 'Marca eliminada correctamente' });
    } catch (error) {
      console.error('Error en delete de marcaController:', error);
      res.status(500).json({ message: 'Error al eliminar la marca' });
    }
  }
};