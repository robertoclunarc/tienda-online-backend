export interface Subcategoria {
    idSubCategoria?: number;
    descSubCategoria: string;
    fkCategoria: number;
  }
  
  import pool from '../config/db.config';
  
  export const SubcategoriaModel = {
    // Obtener todas las subcategorías
    findAll: async (): Promise<Subcategoria[]> => {
      try {
        const [rows] = await pool.query('SELECT * FROM subcategorias ORDER BY descSubCategoria');
        return rows as Subcategoria[];
      } catch (error) {
        console.error('Error al obtener subcategorías:', error);
        throw error;
      }
    },
  
    // Obtener subcategorías por ID de categoría
    findByCategoria: async (categoriaId: number): Promise<Subcategoria[]> => {
      try {
        const [rows] = await pool.query('SELECT * FROM subcategorias WHERE fkCategoria = ? ORDER BY descSubCategoria', [categoriaId]);
        return rows as Subcategoria[];
      } catch (error) {
        console.error(`Error al obtener subcategorías para categoría ${categoriaId}:`, error);
        throw error;
      }
    },
  
    // Obtener una subcategoría por ID
    findById: async (id: number): Promise<Subcategoria | null> => {
      try {
        const [rows] = await pool.query('SELECT * FROM subcategorias WHERE idSubCategoria = ?', [id]);
        const subcategorias = rows as Subcategoria[];
        return subcategorias.length > 0 ? subcategorias[0] : null;
      } catch (error) {
        console.error(`Error al obtener subcategoría con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Crear una nueva subcategoría
    create: async (subcategoria: Subcategoria): Promise<number> => {
      try {
        const [result] = await pool.query('INSERT INTO subcategorias (descSubCategoria, fkCategoria) VALUES (?, ?)', 
          [subcategoria.descSubCategoria, subcategoria.fkCategoria]);
        const result2 = result as { insertId: number };
        return result2.insertId;
      } catch (error) {
        console.error('Error al crear subcategoría:', error);
        throw error;
      }
    },
  
    // Actualizar una subcategoría
    update: async (id: number, subcategoria: Subcategoria): Promise<boolean> => {
      try {
        const [result] = await pool.query('UPDATE subcategorias SET descSubCategoria = ?, fkCategoria = ? WHERE idSubCategoria = ?', 
          [subcategoria.descSubCategoria, subcategoria.fkCategoria, id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar subcategoría con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar una subcategoría
    delete: async (id: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('DELETE FROM subcategorias WHERE idSubCategoria = ?', [id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar subcategoría con ID ${id}:`, error);
        throw error;
      }
    }
  };