import { Request, Response } from 'express';
import { ModeloModel, Modelo } from '../models/modelo.model';

export const modeloController = {
  // Obtener todos los modelos
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const modelos = await ModeloModel.findAll();
      res.json(modelos);
    } catch (error) {
      console.error('Error en getAll de modeloController:', error);
      res.status(500).json({ message: 'Error al obtener modelos' });
    }
  },

  // Obtener modelos por marca
  getByMarca: async (req: Request, res: Response): Promise<void> => {
    try {
      const marcaId = parseInt(req.params.marcaId);
      const modelos = await ModeloModel.findByMarca(marcaId);
      res.json(modelos);
    } catch (error) {
      console.error('Error en getByMarca de modeloController:', error);
      res.status(500).json({ message: 'Error al obtener modelos por marca' });
    }
  },

  // Obtener un modelo por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const modelo = await ModeloModel.findById(id);
      
      if (!modelo) {
        res.status(404).json({ message: 'Modelo no encontrado' });
        return;
      }
      
      res.json(modelo);
    } catch (error) {
      console.error(`Error en getById de modeloController:`, error);
      res.status(500).json({ message: 'Error al obtener el modelo' });
    }
  },

  // Crear un nuevo modelo
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevoModelo: Modelo = req.body;
      const id = await ModeloModel.create(nuevoModelo);
      res.status(201).json({ id, message: 'Modelo creado correctamente' });
    } catch (error) {
      console.error('Error en create de modeloController:', error);
      res.status(500).json({ message: 'Error al crear el modelo' });
    }
  },

  // Actualizar un modelo
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const modeloData: Modelo = req.body;
      
      const exitosoUpdate = await ModeloModel.update(id, modeloData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Modelo no encontrado' });
        return;
      }
      
      res.json({ message: 'Modelo actualizado correctamente' });
    } catch (error) {
      console.error('Error en update de modeloController:', error);
      res.status(500).json({ message: 'Error al actualizar el modelo' });
    }
  },

  // Eliminar un modelo
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await ModeloModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Modelo no encontrado' });
        return;
      }
      
      res.json({ message: 'Modelo eliminado correctamente' });
    } catch (error) {
      console.error('Error en delete de modeloController:', error);
      res.status(500).json({ message: 'Error al eliminar el modelo' });
    }
  }
};