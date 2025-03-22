export interface Modelo {
    idModelo?: number;
    descModelo: string;
    fkMarca: number;
  }
  
  import pool from '../config/db.config';
  
  export const ModeloModel = {
    // Obtener todos los modelos
    findAll: async (): Promise<Modelo[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT m.*, ma.descMarca as nombreMarca
          FROM modelos m
          JOIN marcas ma ON m.fkMarca = ma.idMarca
          ORDER BY m.descModelo
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
        const [rows] = await pool.query(`
          SELECT m.*, ma.descMarca as nombreMarca
          FROM modelos m
          JOIN marcas ma ON m.fkMarca = ma.idMarca
          WHERE m.fkMarca = ?
          ORDER BY m.descModelo
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
        const [rows] = await pool.query(`
          SELECT m.*, ma.descMarca as nombreMarca
          FROM modelos m
          JOIN marcas ma ON m.fkMarca = ma.idMarca
          WHERE m.idModelo = ?
        `, [id]);
        
        const modelos = rows as Modelo[];
        return modelos.length > 0 ? modelos[0] : null;
      } catch (error) {
        console.error(`Error al obtener modelo con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Crear un nuevo modelo
    create: async (modelo: Modelo): Promise<number> => {
      try {
        const [result] = await pool.query('INSERT INTO modelos (descModelo, fkMarca) VALUES (?, ?)', 
          [modelo.descModelo, modelo.fkMarca]);
        const result2 = result as { insertId: number };
        return result2.insertId;
      } catch (error) {
        console.error('Error al crear modelo:', error);
        throw error;
      }
    },
  
    // Actualizar un modelo
    update: async (id: number, modelo: Modelo): Promise<boolean> => {
      try {
        const [result] = await pool.query('UPDATE modelos SET descModelo = ?, fkMarca = ? WHERE idModelo = ?', 
          [modelo.descModelo, modelo.fkMarca, id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar modelo con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar un modelo
    delete: async (id: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('DELETE FROM modelos WHERE idModelo = ?', [id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar modelo con ID ${id}:`, error);
        throw error;
      }
    }
  };