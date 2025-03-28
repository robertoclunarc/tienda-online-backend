export interface Subcategoria {
  idsubcategoria?: number;
  descsubcategoria: string;
  fkcategoria: number;
}

import pool from '../config/db.config';

export const SubcategoriaModel = {
  // Obtener todas las subcategorías
  findAll: async (): Promise<Subcategoria[]> => {
      try {
          const { rows } = await pool.query('SELECT * FROM subcategorias ORDER BY descsubcategoria');
          return rows as Subcategoria[];
      } catch (error) {
          console.error('Error al obtener subcategorías:', error);
          throw error;
      }
  },

  // Obtener subcategorías por ID de categoría
  findByCategoria: async (categoriaId: number): Promise<Subcategoria[]> => {
      try {
          const { rows } = await pool.query(
              'SELECT * FROM subcategorias WHERE fkcategoria = $1 ORDER BY descsubcategoria', 
              [categoriaId]
          );
          return rows as Subcategoria[];
      } catch (error) {
          console.error(`Error al obtener subcategorías para categoría ${categoriaId}:`, error);
          throw error;
      }
  },

  // Obtener una subcategoría por ID
  findById: async (id: number): Promise<Subcategoria | null> => {
      try {
          const { rows } = await pool.query(
              'SELECT * FROM subcategorias WHERE idsubcategoria = $1', 
              [id]
          );
          return rows.length > 0 ? rows[0] : null;
      } catch (error) {
          console.error(`Error al obtener subcategoría con ID ${id}:`, error);
          throw error;
      }
  },

  // Crear una nueva subcategoría
  create: async (subcategoria: Subcategoria): Promise<number> => {
      try {
          const { rows } = await pool.query(
              'INSERT INTO subcategorias (descsubcategoria, fkcategoria) VALUES ($1, $2) RETURNING idsubcategoria',
              [subcategoria.descsubcategoria, subcategoria.fkcategoria]
          );
          return rows[0].idsubcategoria; // PostgreSQL devuelve en minúsculas
      } catch (error) {
          console.error('Error al crear subcategoría:', error);
          throw error;
      }
  },

  // Actualizar una subcategoría
  update: async (id: number, subcategoria: Subcategoria): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'UPDATE subcategorias SET descsubcategoria = $1, fkcategoria = $2 WHERE idsubcategoria = $3',
              [subcategoria.descsubcategoria, subcategoria.fkcategoria, id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar subcategoría con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar una subcategoría
  delete: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'DELETE FROM subcategorias WHERE idsubcategoria = $1',
              [id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar subcategoría con ID ${id}:`, error);
          throw error;
      }
  }
};