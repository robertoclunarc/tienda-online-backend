import { Request, Response } from 'express';
import { UsuarioModel, Usuario } from '../models/usuario.model';

export const usuarioController = {
  // Obtener todos los usuarios
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const usuarios = await UsuarioModel.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error('Error en getAll de usuarioController:', error);
      res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  },

  // Obtener un usuario por ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const usuario = await UsuarioModel.findById(id);
      
      if (!usuario) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      res.json(usuario);
    } catch (error) {
      console.error(`Error en getById de usuarioController:`, error);
      res.status(500).json({ message: 'Error al obtener el usuario' });
    }
  },

  // Crear un nuevo usuario
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const nuevoUsuario: Usuario = req.body;
      
      // Verificar si el email ya existe
      const emailExists = await UsuarioModel.emailExists(nuevoUsuario.emailUser);
      if (emailExists) {
        res.status(400).json({ message: 'El email ya está registrado' });
        return;
      }
      
      const id = await UsuarioModel.create(nuevoUsuario);
      res.status(201).json({ id, message: 'Usuario creado correctamente' });
    } catch (error) {
      console.error('Error en create de usuarioController:', error);
      res.status(500).json({ message: 'Error al crear el usuario' });
    }
  },

  // Actualizar un usuario
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const usuarioData: Partial<Usuario> = req.body;
      
      // Si se está actualizando el email, verificar que no exista ya
      if (usuarioData.emailUser) {
        const emailExists = await UsuarioModel.emailExists(usuarioData.emailUser);
        const usuario = await UsuarioModel.findById(id);
        
        // Si el email existe y no es el del usuario actual
        if (emailExists && usuario && usuario.emailUser !== usuarioData.emailUser) {
          res.status(400).json({ message: 'El email ya está registrado por otro usuario' });
          return;
        }
      }
      
      const exitosoUpdate = await UsuarioModel.update(id, usuarioData);
      
      if (!exitosoUpdate) {
        res.status(404).json({ message: 'Usuario no encontrado o no se realizaron cambios' });
        return;
      }
      
      res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
      console.error('Error en update de usuarioController:', error);
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  },

  // Eliminar un usuario (cambiar estatus a INACTIVO)
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const exitosoDelete = await UsuarioModel.delete(id);
      
      if (!exitosoDelete) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error en delete de usuarioController:', error);
      res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
  }
};