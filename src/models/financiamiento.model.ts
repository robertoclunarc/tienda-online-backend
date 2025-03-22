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
        const [rows] = await pool.query(`
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
        const [rows] = await pool.query('SELECT * FROM financiamientos ORDER BY cantCuotas');
        return rows as Financiamiento[];
      } catch (error) {
        console.error('Error al obtener financiamientos:', error);
        throw error;
      }
    },
  
    // Obtener un financiamiento por ID
    findById: async (id: number): Promise<Financiamiento | null> => {
      try {
        const [rows] = await pool.query('SELECT * FROM financiamientos WHERE idFinanciamiento = ?', [id]);
        const financiamientos = rows as Financiamiento[];
        return financiamientos.length > 0 ? financiamientos[0] : null;
      } catch (error) {
        console.error(`Error al obtener financiamiento con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Crear un nuevo financiamiento
    create: async (financiamiento: Financiamiento): Promise<number> => {
      try {
        const [result] = await pool.query(`
          INSERT INTO financiamientos 
          (descFinanciamiento, tasaFinanciamiento, cantCuotas, estatusFinanciamiento) 
          VALUES (?, ?, ?, ?)
        `, [
          financiamiento.descFinanciamiento,
          financiamiento.tasaFinanciamiento,
          financiamiento.cantCuotas,
          financiamiento.estatusFinanciamiento || 'ACTIVO'
        ]);
        
        const result2 = result as { insertId: number };
        return result2.insertId;
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
  
        if (financiamiento.descFinanciamiento !== undefined) {
          updates.push('descFinanciamiento = ?');
          values.push(financiamiento.descFinanciamiento);
        }
        if (financiamiento.tasaFinanciamiento !== undefined) {
          updates.push('tasaFinanciamiento = ?');
          values.push(financiamiento.tasaFinanciamiento);
        }
        if (financiamiento.cantCuotas !== undefined) {
          updates.push('cantCuotas = ?');
          values.push(financiamiento.cantCuotas);
        }
        if (financiamiento.estatusFinanciamiento !== undefined) {
          updates.push('estatusFinanciamiento = ?');
          values.push(financiamiento.estatusFinanciamiento);
        }
  
        if (updates.length === 0) {
          return false;
        }
  
        query += updates.join(', ') + ' WHERE idFinanciamiento = ?';
        values.push(id);
  
        const [result] = await pool.query(query, values);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar financiamiento con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar un financiamiento (cambiar estatus a INACTIVO)
    delete: async (id: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('UPDATE financiamientos SET estatusFinanciamiento = ? WHERE idFinanciamiento = ?', ['INACTIVO', id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar financiamiento con ID ${id}:`, error);
        throw error;
      }
    }
  };