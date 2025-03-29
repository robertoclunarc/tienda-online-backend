export interface Marca {
  idmarca?: number;
  descmarca: string;
}

import pool from '../config/db.config';

export const MarcaModel = {
  // Obtener todas las marcas
  findAll: async (): Promise<Marca[]> => {
      try {
          const { rows } = await pool.query('SELECT * FROM marcas ORDER BY descmarca');
          return rows as Marca[];
      } catch (error) {
          console.error('Error al obtener marcas:', error);
          throw error;
      }
  },

  // Obtener una marca por ID
  findById: async (id: number): Promise<Marca | null> => {
      try {
          const { rows } = await pool.query(
              'SELECT * FROM marcas WHERE idmarca = $1', 
              [id]
          );
          return rows.length > 0 ? rows[0] : null;
      } catch (error) {
          console.error(`Error al obtener marca con ID ${id}:`, error);
          throw error;
      }
  },

  // Crear una nueva marca
  create: async (marca: Marca): Promise<number> => {
      try {
          const { rows } = await pool.query(
              'INSERT INTO marcas (descmarca) VALUES ($1) RETURNING idmarca',
              [marca.descmarca]
          );
          return rows[0].idmarca; // PostgreSQL devuelve en minúsculas
      } catch (error) {
          console.error('Error al crear marca:', error);
          throw error;
      }
  },

  // Actualizar una marca
  update: async (id: number, marca: Marca): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'UPDATE marcas SET descmarca = $1 WHERE idmarca = $2',
              [marca.descmarca, id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar marca con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar una marca
  delete: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'DELETE FROM marcas WHERE idmarca = $1', 
              [id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar marca con ID ${id}:`, error);
          throw error;
      }
  },

  // Obtener modelos por marca
  getModelos: async (marcaId: number): Promise<{ idmodelo: number; descmodelo: string }[]> => {
      try {
          const { rows } = await pool.query(
              'SELECT idmodelo, descmodelo FROM modelos WHERE fkmarca = $1 ORDER BY descmodelo',
              [marcaId]
          );
          return rows as { idmodelo: number; descmodelo: string }[];
      } catch (error) {
          console.error(`Error al obtener modelos para marca ${marcaId}:`, error);
          throw error;
      }
  }
};