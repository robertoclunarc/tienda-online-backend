export interface Financiamiento {
  idfinanciamiento?: number;
  descfinanciamiento: string;
  tasafinanciamiento: string;
  cantcuotas: number;
  estatusfinanciamiento: string;
}

import pool from '../config/db.config';

export const FinanciamientoModel = {
  // Obtener todos los financiamientos activos
  findAllActive: async (): Promise<Financiamiento[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT * FROM financiamientos 
              WHERE estatusfinanciamiento = 'ACTIVO'
              ORDER BY cantcuotas
          `);
          return rows as Financiamiento[];
      } catch (error) {
          console.error('Error al obtener financiamientos activos:', error);
          throw error;
      }
  },

  // Obtener todos los financiamientos
  findAll: async (): Promise<Financiamiento[]> => {
      try {
          const { rows } = await pool.query('SELECT * FROM financiamientos ORDER BY cantcuotas');
          return rows as Financiamiento[];
      } catch (error) {
          console.error('Error al obtener financiamientos:', error);
          throw error;
      }
  },

  // Obtener un financiamiento por ID
  findById: async (id: number): Promise<Financiamiento | null> => {
      try {
          const { rows } = await pool.query(
              'SELECT * FROM financiamientos WHERE idfinanciamiento = $1', 
              [id]
          );
          return rows.length > 0 ? rows[0] : null;
      } catch (error) {
          console.error(`Error al obtener financiamiento con ID ${id}:`, error);
          throw error;
      }
  },

  // Crear un nuevo financiamiento
  create: async (financiamiento: Financiamiento): Promise<number> => {
      try {
          const { rows } = await pool.query(`
              INSERT INTO financiamientos 
              (descfinanciamiento, tasafinanciamiento, cantcuotas, estatusfinanciamiento) 
              VALUES ($1, $2, $3, $4)
              RETURNING idfinanciamiento
          `, [
              financiamiento.descfinanciamiento,
              financiamiento.tasafinanciamiento,
              financiamiento.cantcuotas,
              financiamiento.estatusfinanciamiento || 'ACTIVO'
          ]);
          
          return rows[0].idfinanciamiento; // PostgreSQL devuelve en minúsculas
      } catch (error) {
          console.error('Error al crear financiamiento:', error);
          throw error;
      }
  },

  // Actualizar un financiamiento
  update: async (id: number, financiamiento: Partial<Financiamiento>): Promise<boolean> => {
      try {
          let query = 'UPDATE financiamientos SET ';
          const updates: string[] = [];
          const values: any[] = [];
          let paramCount = 1;

          if (financiamiento.descfinanciamiento !== undefined) {
              updates.push(`descfinanciamiento = $${paramCount}`);
              values.push(financiamiento.descfinanciamiento);
              paramCount++;
          }
          if (financiamiento.tasafinanciamiento !== undefined) {
              updates.push(`tasafinanciamiento = $${paramCount}`);
              values.push(financiamiento.tasafinanciamiento);
              paramCount++;
          }
          if (financiamiento.cantcuotas !== undefined) {
              updates.push(`cantcuotas = $${paramCount}`);
              values.push(financiamiento.cantcuotas);
              paramCount++;
          }
          if (financiamiento.estatusfinanciamiento !== undefined) {
              updates.push(`estatusfinanciamiento = $${paramCount}`);
              values.push(financiamiento.estatusfinanciamiento);
              paramCount++;
          }

          if (updates.length === 0) {
              return false;
          }

          query += updates.join(', ') + ` WHERE idfinanciamiento = $${paramCount}`;
          values.push(id);

          const { rowCount } = await pool.query(query, values);
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar financiamiento con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar un financiamiento (cambiar estatus a INACTIVO)
  delete: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'UPDATE financiamientos SET estatusfinanciamiento = $1 WHERE idfinanciamiento = $2', 
              ['INACTIVO', id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar financiamiento con ID ${id}:`, error);
          throw error;
      }
  }
};