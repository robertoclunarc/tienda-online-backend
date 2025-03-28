export interface Categoria {
  idcategoria?: number;
  desccategoria: string;
}

import pool from '../config/db.config';

export const CategoriaModel = {
  // Obtener todas las categorías
  findAll: async (): Promise<Categoria[]> => {
      try {
          const { rows } = await pool.query('SELECT * FROM categorias ORDER BY descCategoria');
          return rows as Categoria[];
      } catch (error) {
          console.error('Error al obtener categorías:', error);
          throw error;
      }
  },

  // Obtener una categoría por ID
  findById: async (id: number): Promise<Categoria | null> => {
      try {
          const { rows } = await pool.query('SELECT * FROM categorias WHERE idCategoria = $1', [id]);
          return rows.length > 0 ? rows[0] : null;
      } catch (error) {
          console.error(`Error al obtener categoría con ID ${id}:`, error);
          throw error;
      }
  },

  // Crear una nueva categoría
  create: async (categoria: Categoria): Promise<number> => {
      try {
          const { rows } = await pool.query(
              'INSERT INTO categorias (descCategoria) VALUES ($1) RETURNING idCategoria',
              [categoria.desccategoria]
          );
          return rows[0].idcategoria; // PostgreSQL devuelve en minúsculas
      } catch (error) {
          console.error('Error al crear categoría:', error);
          throw error;
      }
  },

  // Actualizar una categoría
  update: async (id: number, categoria: Categoria): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'UPDATE categorias SET descCategoria = $1 WHERE idCategoria = $2',
              [categoria.desccategoria, id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar categoría con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar una categoría
  delete: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query('DELETE FROM categorias WHERE idCategoria = $1', [id]);
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar categoría con ID ${id}:`, error);
          throw error;
      }
  },

  // Obtener subcategorías por ID de categoría
  getSubcategorias: async (categoriaId: number): Promise<{ idSubCategoria: number; descSubCategoria: string }[]> => {
      try {
          const { rows } = await pool.query(
              'SELECT idSubCategoria, descSubCategoria FROM subcategorias WHERE fkCategoria = $1 ORDER BY descSubCategoria',
              [categoriaId]
          );
          return rows as { idSubCategoria: number; descSubCategoria: string }[];
      } catch (error) {
          console.error(`Error al obtener subcategorías para categoría ${categoriaId}:`, error);
          throw error;
      }
  }
};