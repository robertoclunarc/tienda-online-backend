import pool from '../config/db.config';

export interface ProductoImagen {
  idImagen?: number;
  descImagen?: string;
  imagen: string;
  miniatura?: boolean;
  principal?: boolean;
  fkProducto: number;
}

export const ProductoImagenModel = {
  // Obtener todas las imágenes de un producto
  findByProductId: async (productoId: number): Promise<ProductoImagen[]> => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM productosimagenes WHERE fkProducto = $1',
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
      const { rows } = await pool.query(
        'SELECT * FROM productosimagenes WHERE fkProducto = $1 AND principal = true LIMIT 1',
        [productoId]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error al obtener imagen principal del producto ${productoId}:`, error);
      throw error;
    }
  },

  // Obtener las miniaturas de un producto
  findThumbnailsByProductId: async (productoId: number): Promise<ProductoImagen[]> => {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM productosimagenes WHERE fkProducto = $1 AND miniatura = true',
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
      const { rows } = await pool.query(
        'SELECT * FROM productosimagenes WHERE idImagen = $1', 
        [id]
      );
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Error al obtener imagen con ID ${id}:`, error);
      throw error;
    }
  },

  // Crear una nueva imagen
  create: async (imagen: ProductoImagen): Promise<number> => {
    try {
      // Si es imagen principal, asegurarse de quitar el flag principal de otras imágenes del producto
      if (imagen.principal) {
        await pool.query(
          'UPDATE productosimagenes SET principal = false WHERE fkProducto = $1',
          [imagen.fkProducto]
        );
      }

      const { rows } = await pool.query(
        `INSERT INTO productosimagenes 
         (descImagen, imagen, miniatura, principal, fkProducto) 
         VALUES ($1, $2, $3, $4, $5)
         RETURNING idImagen`,
        [
          imagen.descImagen || null,
          imagen.imagen,
          imagen.miniatura || false,
          imagen.principal || false,
          imagen.fkProducto
        ]
      );
      
      return rows[0].idimagen;
    } catch (error) {
      console.error('Error al crear imagen:', error);
      throw error;
    }
  },

  // Actualizar una imagen
  update: async (id: number, imagen: Partial<ProductoImagen>): Promise<boolean> => {
    try {
      // Si se está estableciendo como imagen principal, quitar el flag de otras imágenes
      if (imagen.principal) {
        const currentImage = await ProductoImagenModel.findById(id);
        if (currentImage) {
          await pool.query(
            'UPDATE productosimagenes SET principal = false WHERE fkProducto = $1',
            [currentImage.fkProducto]
          );
        }
      }

      // Construir la consulta dinámica para la actualización
      let updateQuery = 'UPDATE productosimagenes SET ';
      const values: any[] = [];
      const fields: string[] = [];
      let paramCount = 1;

      if (imagen.descImagen !== undefined) {
        fields.push(`descImagen = $${paramCount}`);
        values.push(imagen.descImagen);
        paramCount++;
      }
      if (imagen.imagen !== undefined) {
        fields.push(`imagen = $${paramCount}`);
        values.push(imagen.imagen);
        paramCount++;
      }
      if (imagen.miniatura !== undefined) {
        fields.push(`miniatura = $${paramCount}`);
        values.push(imagen.miniatura);
        paramCount++;
      }
      if (imagen.principal !== undefined) {
        fields.push(`principal = $${paramCount}`);
        values.push(imagen.principal);
        paramCount++;
      }
      if (imagen.fkProducto !== undefined) {
        fields.push(`fkProducto = $${paramCount}`);
        values.push(imagen.fkProducto);
        paramCount++;
      }

      if (fields.length === 0) {
        return false; // No hay campos para actualizar
      }

      updateQuery += fields.join(', ') + ` WHERE idImagen = $${paramCount}`;
      values.push(id);

      const { rowCount } = await pool.query(updateQuery, values);
      return rowCount !== null && rowCount > 0;
    } catch (error) {
      console.error(`Error al actualizar imagen con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar una imagen
  delete: async (id: number): Promise<boolean> => {
    try {
      const { rowCount } = await pool.query(
        'DELETE FROM productosimagenes WHERE idImagen = $1', 
        [id]
      );
      return rowCount !== null && rowCount > 0;
    } catch (error) {
      console.error(`Error al eliminar imagen con ID ${id}:`, error);
      throw error;
    }
  }
};