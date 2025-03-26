export interface Financiamiento {
  idFinanciamiento?: number;
  descFinanciamiento: string;
  tasaFinanciamiento: string;
  cantCuotas: number;
  estatusFinanciamiento: string;
}

import pool from '../config/db.config';

export const FinanciamientoModel = {
  // Obtener todos los financiamientos activos
  findAllActive: async (): Promise<Financiamiento[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT * FROM financiamientos 
              WHERE estatusFinanciamiento = 'ACTIVO'
              ORDER BY cantCuotas
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
          const { rows } = await pool.query('SELECT * FROM financiamientos ORDER BY cantCuotas');
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
              'SELECT * FROM financiamientos WHERE idFinanciamiento = $1', 
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
              (descFinanciamiento, tasaFinanciamiento, cantCuotas, estatusFinanciamiento) 
              VALUES ($1, $2, $3, $4)
              RETURNING idFinanciamiento
          `, [
              financiamiento.descFinanciamiento,
              financiamiento.tasaFinanciamiento,
              financiamiento.cantCuotas,
              financiamiento.estatusFinanciamiento || 'ACTIVO'
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

          if (financiamiento.descFinanciamiento !== undefined) {
              updates.push(`descFinanciamiento = $${paramCount}`);
              values.push(financiamiento.descFinanciamiento);
              paramCount++;
          }
          if (financiamiento.tasaFinanciamiento !== undefined) {
              updates.push(`tasaFinanciamiento = $${paramCount}`);
              values.push(financiamiento.tasaFinanciamiento);
              paramCount++;
          }
          if (financiamiento.cantCuotas !== undefined) {
              updates.push(`cantCuotas = $${paramCount}`);
              values.push(financiamiento.cantCuotas);
              paramCount++;
          }
          if (financiamiento.estatusFinanciamiento !== undefined) {
              updates.push(`estatusFinanciamiento = $${paramCount}`);
              values.push(financiamiento.estatusFinanciamiento);
              paramCount++;
          }

          if (updates.length === 0) {
              return false;
          }

          query += updates.join(', ') + ` WHERE idFinanciamiento = $${paramCount}`;
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
              'UPDATE financiamientos SET estatusFinanciamiento = $1 WHERE idFinanciamiento = $2', 
              ['INACTIVO', id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar financiamiento con ID ${id}:`, error);
          throw error;
      }
  }
};