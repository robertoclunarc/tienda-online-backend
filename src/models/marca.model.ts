export interface Marca {
    idMarca?: number;
    descMarca: string;
  }
  
  import pool from '../config/db.config';
  
  export const MarcaModel = {
    // Obtener todas las marcas
    findAll: async (): Promise<Marca[]> => {
      try {
        const [rows] = await pool.query('SELECT * FROM marcas ORDER BY descMarca');
        return rows as Marca[];
      } catch (error) {
        console.error('Error al obtener marcas:', error);
        throw error;
      }
    },
  
    // Obtener una marca por ID
    findById: async (id: number): Promise<Marca | null> => {
      try {
        const [rows] = await pool.query('SELECT * FROM marcas WHERE idMarca = ?', [id]);
        const marcas = rows as Marca[];
        return marcas.length > 0 ? marcas[0] : null;
      } catch (error) {
        console.error(`Error al obtener marca con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Crear una nueva marca
    create: async (marca: Marca): Promise<number> => {
      try {
        const [result] = await pool.query('INSERT INTO marcas (descMarca) VALUES (?)', [marca.descMarca]);
        const result2 = result as { insertId: number };
        return result2.insertId;
      } catch (error) {
        console.error('Error al crear marca:', error);
        throw error;
      }
    },
  
    // Actualizar una marca
    update: async (id: number, marca: Marca): Promise<boolean> => {
      try {
        const [result] = await pool.query('UPDATE marcas SET descMarca = ? WHERE idMarca = ?', [marca.descMarca, id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar marca con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar una marca
    delete: async (id: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('DELETE FROM marcas WHERE idMarca = ?', [id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar marca con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Obtener modelos por marca
    getModelos: async (marcaId: number): Promise<{ idModelo: number; descModelo: string }[]> => {
      try {
        const [rows] = await pool.query(
          'SELECT idModelo, descModelo FROM modelos WHERE fkMarca = ? ORDER BY descModelo', 
          [marcaId]
        );
        return rows as { idModelo: number; descModelo: string }[];
      } catch (error) {
        console.error(`Error al obtener modelos para marca ${marcaId}:`, error);
        throw error;
      }
    }
  };