import { Request, Response } from 'express';
import { ProductoImagenModel, ProductoImagen } from '../models/productosImagenes.model';

export const productosImagenesController = {
  // Obtener todas las imágenes de un producto
  getByProductId: async (req: Request, res: Response): Promise<void> => {
    try {
      const productoId = parseInt(req.params.productoId);
      const imagenes = await ProductoImagenModel.findByProductId(productoId);
      res.json(imagenes);
    } catch (error) {
      console.error('Error en getByProductId de productosImagenesController:', error);
      res.status(500).json({ message: 'Error al obtener imágenes del producto' });
    }
  },

  // Obtener la imagen principal de un producto
  getMainImageByProductId: async (req: Request, res: Response): Promise<void> => {
    try {
      const productoId = parseInt(req.params.productoId);
      const imagen = await ProductoImagenModel.findMainImageByProductId(productoId);
      
      if (!imagen) {
        res.status(404).json({ message: 'No se encontró la imagen principal para este producto' });
        return;
      }
      
      res.json(imagen);
    } catch (error) {
      console.error('Error en getMainImageByProductId de productosImagenesController:', error);
      res.status(500).json({ message: 'Error al obtener la imagen principal del producto' });
    }
  },

  // Obtener miniaturas de un producto
  getThumbnailsByProductId: async (req: Request, res: Response): Promise<void> => {
    try {
      const productoId = parseInt(req.params.productoId);
      const imagenes = await ProductoImagenModel.findThumbnailsByProductId(productoId);
      res.json(imagenes);
    } catch (error) {
      console.error('Error en getThumbnailsByProductId de productosImagenesController:', error);
      res.status(500).json({ message: 'Error al obtener miniaturas del producto' });
    }
  },

  // Obtener una imagen por su ID
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const imagen = await ProductoImagenModel.findById(id);
      
      if (!imagen) {
        res.status(404).json({ message: 'Imagen no encontrada' });
        return;
      }
      
      res.json(imagen);
    } catch (error) {
      console.error('Error en getById de productosImagenesController:', error);
      res.status(500).json({ message: 'Error al obtener la imagen' });
    }
  },

  // Crear una nueva imagen
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const imagenData: ProductoImagen = req.body;
      
      // Validaciones básicas
      if (!imagenData.imagen) {
        res.status(400).json({ message: 'La URL de la imagen es requerida' });
        return;
      }
      
      if (!imagenData.fkproducto) {
        res.status(400).json({ message: 'El ID del producto es requerido' });
        return;
      }
      
      const id = await ProductoImagenModel.create(imagenData);
      res.status(201).json({ 
        message: 'Imagen creada correctamente', 
        id,
        imagen: { ...imagenData, idImagen: id }
      });
    } catch (error) {
      console.error('Error en create de productosImagenesController:', error);
      res.status(500).json({ message: 'Error al crear la imagen' });
    }
  },

  // Actualizar una imagen
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const imagenData: Partial<ProductoImagen> = req.body;
      
      // Verificar si la imagen existe
      const existingImage = await ProductoImagenModel.findById(id);
      if (!existingImage) {
        res.status(404).json({ message: 'Imagen no encontrada' });
        return;
      }
      
      const success = await ProductoImagenModel.update(id, imagenData);
      
      if (success) {
        // Obtener la imagen actualizada
        const updatedImage = await ProductoImagenModel.findById(id);
        res.json({ 
          message: 'Imagen actualizada correctamente',
          imagen: updatedImage
        });
      } else {
        res.status(400).json({ message: 'No se pudo actualizar la imagen' });
      }
    } catch (error) {
      console.error('Error en update de productosImagenesController:', error);
      res.status(500).json({ message: 'Error al actualizar la imagen' });
    }
  },

  // Eliminar una imagen
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      // Verificar si la imagen existe
      const existingImage = await ProductoImagenModel.findById(id);
      if (!existingImage) {
        res.status(404).json({ message: 'Imagen no encontrada' });
        return;
      }
      
      const success = await ProductoImagenModel.delete(id);
      
      if (success) {
        res.json({ message: 'Imagen eliminada correctamente' });
      } else {
        res.status(400).json({ message: 'No se pudo eliminar la imagen' });
      }
    } catch (error) {
      console.error('Error en delete de productosImagenesController:', error);
      res.status(500).json({ message: 'Error al eliminar la imagen' });
    }
  }
};