import { Request, Response } from 'express';
import { ContactoModel, Contacto } from '../models/contacto.model';

export const contactoController = {
  // Obtener todos los contactos activos
  getAllActive: async (req: Request, res: Response): Promise<void> => {
    try {
      const contactos = await ContactoModel.findAllActive();
      res.json(contactos);
    } catch (error) {
      console.error('Error en getAllActive de contactoController:', error);
      res.status(500).json({ message: 'Error al obtener contactos activos' });
    }
  },

  // Obtener todos los contactos
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const contactos = await ContactoModel.findAll();
      res.json(contactos);
    } catch (error) {
      console.error('Error en getAll de contactoController:', error);
      res.status(500).json({ message: 'Error al obtener contactos' });
    }
  },

  // Obtener un contacto por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const contacto = await ContactoModel.findById(id);
      
      if (!contacto) {
        res.status(404).json({ message: 'Contacto no encontrado' });
        return;
      }
      
      res.json(contacto);
    } catch (error) {
      console.error(`Error en getById de contactoController:`, error);
      res.status(500).json({ message: 'Error al obtener el contacto' });
    }
  },

  // Crear un nuevo contacto
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevoContacto: Contacto = req.body;
      const id = await ContactoModel.create(nuevoContacto);
      res.status(201).json({ id, message: 'Contacto creado correctamente' });
    } catch (error) {
      console.error('Error en create de contactoController:', error);
      res.status(500).json({ message: 'Error al crear el contacto' });
    }
  },

  // Actualizar un contacto
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const contactoData: Partial<Contacto> = req.body;
      
      const exitosoUpdate = await ContactoModel.update(id, contactoData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Contacto no encontrado o no se realizaron cambios' });
        return;
      }
      
      res.json({ message: 'Contacto actualizado correctamente' });
    } catch (error) {
      console.error('Error en update de contactoController:', error);
      res.status(500).json({ message: 'Error al actualizar el contacto' });
    }
  },

  // Eliminar un contacto (cambiar estatus a INACTIVO)
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await ContactoModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Contacto no encontrado' });
        return;
      }
      
      res.json({ message: 'Contacto eliminado correctamente' });
    } catch (error) {
      console.error('Error en delete de contactoController:', error);
      res.status(500).json({ message: 'Error al eliminar el contacto' });
    }
  }
};