import pool from '../config/db.config';

export interface ProductoImagen {
  idImagen?: number;
  descImagen?: string;
  imagen: string;
  miniatura?: number; // 1 o 0 para true o false
  principal?: number; // 1 o 0 para true o false
  fkProducto: number;
}

export const ProductoImagenModel = {
  // Obtener todas las imágenes de un producto
  findByProductId: async (productoId: number): Promise<ProductoImagen[]> => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM productosimagenes WHERE fkProducto = ?',
        [productoId]
      );
      return rows as ProductoImagen[];
    } catch (error) {
      console.error(`Error al obtener imágenes del producto ${productoId}:`, error);
      throw error;
    }
  },

  // Obtener la imagen principal de un producto
  findMainImageByProductId: async (productoId: number): Promise<ProductoImagen | null> => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM productosimagenes WHERE fkProducto = ? AND principal = 1 LIMIT 1',
        [productoId]
      );
      const images = rows as ProductoImagen[];
      return images.length > 0 ? images[0] : null;
    } catch (error) {
      console.error(`Error al obtener imagen principal del producto ${productoId}:`, error);
      throw error;
    }
  },

  // Obtener las miniaturas de un producto
  findThumbnailsByProductId: async (productoId: number): Promise<ProductoImagen[]> => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM productosimagenes WHERE fkProducto = ? AND miniatura = 1',
        [productoId]
      );
      return rows as ProductoImagen[];
    } catch (error) {
      console.error(`Error al obtener miniaturas del producto ${productoId}:`, error);
      throw error;
    }
  },

  // Obtener una imagen por su ID
  findById: async (id: number): Promise<ProductoImagen | null> => {
    try {
      const [rows] = await pool.query('SELECT * FROM productosimagenes WHERE idImagen = ?', [id]);
      const images = rows as ProductoImagen[];
      return images.length > 0 ? images[0] : null;
    } catch (error) {
      console.error(`Error al obtener imagen con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva imagen
  create: async (imagen: ProductoImagen): Promise<number> => {
    try {
      // Si es imagen principal, asegurarse de quitar el flag principal de otras imágenes del producto
      if (imagen.principal === 1) {
        await pool.query(
          'UPDATE productosimagenes SET principal = 0 WHERE fkProducto = ?',
          [imagen.fkProducto]
        );
      }

      const [result] = await pool.query(
        'INSERT INTO productosimagenes (descImagen, imagen, miniatura, principal, fkProducto) VALUES (?, ?, ?, ?, ?)',
        [
          imagen.descImagen || null,
          imagen.imagen,
          imagen.miniatura || 0,
          imagen.principal || 0,
          imagen.fkProducto
        ]
      );
      
      const insertResult = result as { insertId: number };
      return insertResult.insertId;
    } catch (error) {
      console.error('Error al crear imagen:', error);
      throw error;
    }
  },

  // Actualizar una imagen
  update: async (id: number, imagen: Partial<ProductoImagen>): Promise<boolean> => {
    try {
      // Si se está estableciendo como imagen principal, quitar el flag de otras imágenes
      if (imagen.principal === 1) {
        const currentImage = await ProductoImagenModel.findById(id);
        if (currentImage) {
          await pool.query(
            'UPDATE productosimagenes SET principal = 0 WHERE fkProducto = ?',
            [currentImage.fkProducto]
          );
        }
      }

      // Construir la consulta dinámica para la actualización
      let updateQuery = 'UPDATE productosimagenes SET ';
      const values: any[] = [];
      const fields: string[] = [];

      if (imagen.descImagen !== undefined) {
        fields.push('descImagen = ?');
        values.push(imagen.descImagen);
      }
      if (imagen.imagen !== undefined) {
        fields.push('imagen = ?');
        values.push(imagen.imagen);
      }
      if (imagen.miniatura !== undefined) {
        fields.push('miniatura = ?');
        values.push(imagen.miniatura);
      }
      if (imagen.principal !== undefined) {
        fields.push('principal = ?');
        values.push(imagen.principal);
      }
      if (imagen.fkProducto !== undefined) {
        fields.push('fkProducto = ?');
        values.push(imagen.fkProducto);
      }

      if (fields.length === 0) {
        return false; // No hay campos para actualizar
      }

      updateQuery += fields.join(', ') + ' WHERE idImagen = ?';
      values.push(id);

      const [result] = await pool.query(updateQuery, values);
      const { affectedRows } = result as { affectedRows: number };
      return affectedRows > 0;
    } catch (error) {
      console.error(`Error al actualizar imagen con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una imagen
  delete: async (id: number): Promise<boolean> => {
    try {
      const [result] = await pool.query('DELETE FROM productosimagenes WHERE idImagen = ?', [id]);
      const { affectedRows } = result as { affectedRows: number };
      return affectedRows > 0;
    } catch (error) {
      console.error(`Error al eliminar imagen con ID ${id}:`, error);
      throw error;
    }
  }
};