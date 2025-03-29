export interface Modelo {
  idmodelo?: number;
  descmodelo: string;
  fkmarca: number;
}

import pool from '../config/db.config';

export const ModeloModel = {
  // Obtener todos los modelos
  findAll: async (): Promise<Modelo[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT m.*, ma.descmarca as nombremarca
              FROM modelos m
              JOIN marcas ma ON m.fkmarca = ma.idmarca
              ORDER BY m.descmodelo
          `);
          return rows as Modelo[];
      } catch (error) {
          console.error('Error al obtener modelos:', error);
          throw error;
      }
  },

  // Obtener modelos por marca
  findByMarca: async (marcaId: number): Promise<Modelo[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT m.*, ma.descmarca as nombremarca
              FROM modelos m
              JOIN marcas ma ON m.fkmarca = ma.idmarca
              WHERE m.fkmarca = $1
              ORDER BY m.descmodelo
          `, [marcaId]);
          return rows as Modelo[];
      } catch (error) {
          console.error(`Error al obtener modelos para marca ${marcaId}:`, error);
          throw error;
      }
  },

  // Obtener un modelo por ID
  findById: async (id: number): Promise<Modelo | null> => {
      try {
          const { rows } = await pool.query(`
              SELECT m.*, ma.descmarca as nombremarca
              FROM modelos m
              JOIN marcas ma ON m.fkmarca = ma.idmarca
              WHERE m.idmodelo = $1
          `, [id]);
          
          return rows.length > 0 ? rows[0] : null;
      } catch (error) {
          console.error(`Error al obtener modelo con ID ${id}:`, error);
          throw error;
      }
  },

  // Crear un nuevo modelo
  create: async (modelo: Modelo): Promise<number> => {
      try {
          const { rows } = await pool.query(
              'INSERT INTO modelos (descmodelo, fkmarca) VALUES ($1, $2) RETURNING idmodelo',
              [modelo.descmodelo, modelo.fkmarca]
          );
          return rows[0].idmodelo; // PostgreSQL devuelve en minúsculas
      } catch (error) {
          console.error('Error al crear modelo:', error);
          throw error;
      }
  },

  // Actualizar un modelo
  update: async (id: number, modelo: Modelo): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'UPDATE modelos SET descmodelo = $1, fkmarca = $2 WHERE idmodelo = $3',
              [modelo.descmodelo, modelo.fkmarca, id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar modelo con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar un modelo
  delete: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'DELETE FROM modelos WHERE idmodelo = $1',
              [id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar modelo con ID ${id}:`, error);
          throw error;
      }
  }
};