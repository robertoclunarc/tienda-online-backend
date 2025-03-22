// Interfaces para los modelos de datos
export interface Producto {
    idProducto?: number;
    nombreProducto: string;
    descProducto?: string;
    precio: string;
    cantInventario: number;
    fkModelo: number;
    fkSubCategoria: number;
    estatus: string;
  }
  
  export interface ProductoConDetalles extends Producto {
    nombreMarca?: string;
    nombreModelo?: string;
    nombreCategoria?: string;
    nombreSubCategoria?: string;
  }
  
  import pool from '../config/db.config';
  
  export const ProductoModel = {
    // Obtener todos los productos
    findAll: async (): Promise<ProductoConDetalles[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkModelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fkSubCategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE p.estatus = 'ACTIVO'
          ORDER BY p.idProducto DESC
        `);
        return rows as ProductoConDetalles[];
      } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
      }
    },
  
    // Obtener productos destacados
    findFeatured: async (limit: number = 8): Promise<ProductoConDetalles[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkModelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fkSubCategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE p.estatus = 'ACTIVO'
          ORDER BY p.idProducto DESC
          LIMIT ?
        `, [limit]);
        return rows as ProductoConDetalles[];
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
        throw error;
      }
    },
  
    // Obtener un producto por ID
    findById: async (id: number): Promise<ProductoConDetalles | null> => {
      try {
        const [rows] = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkModelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fkSubCategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE p.idProducto = ? AND p.estatus = 'ACTIVO'
        `, [id]);
        
        const products = rows as ProductoConDetalles[];
        return products.length > 0 ? products[0] : null;
      } catch (error) {
        console.error(`Error al obtener producto con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Obtener productos por categoría
    findByCategory: async (categoryId: number): Promise<ProductoConDetalles[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkModelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fkSubCategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE c.idCategoria = ? AND p.estatus = 'ACTIVO'
        `, [categoryId]);
        return rows as ProductoConDetalles[];
      } catch (error) {
        console.error(`Error al obtener productos por categoría ${categoryId}:`, error);
        throw error;
      }
    },
  
    // Obtener productos por subcategoría
    findBySubcategory: async (subcategoryId: number): Promise<ProductoConDetalles[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkModelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fkSubCategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE p.fkSubCategoria = ? AND p.estatus = 'ACTIVO'
        `, [subcategoryId]);
        return rows as ProductoConDetalles[];
      } catch (error) {
        console.error(`Error al obtener productos por subcategoría ${subcategoryId}:`, error);
        throw error;
      }
    },
  
    // Crear un nuevo producto
    create: async (producto: Producto): Promise<number> => {
      try {
        const [result] = await pool.query(`
          INSERT INTO productos 
          (nombreProducto, descProducto, precio, cantInventario, fkModelo, fkSubCategoria, estatus) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          producto.nombreProducto, 
          producto.descProducto || null, 
          producto.precio, 
          producto.cantInventario, 
          producto.fkModelo, 
          producto.fkSubCategoria, 
          producto.estatus || 'ACTIVO'
        ]);
        
        const result2 = result as { insertId: number };
        return result2.insertId;
      } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
      }
    },
  
    // Actualizar un producto
    update: async (id: number, producto: Partial<Producto>): Promise<boolean> => {
      try {
        let query = 'UPDATE productos SET ';
        const updates: string[] = [];
        const values: any[] = [];
  
        // Costruimos dinámicamente la consulta basada en los campos que se proporcionan
        if (producto.nombreProducto !== undefined) {
          updates.push('nombreProducto = ?');
          values.push(producto.nombreProducto);
        }
        if (producto.descProducto !== undefined) {
          updates.push('descProducto = ?');
          values.push(producto.descProducto);
        }
        if (producto.precio !== undefined) {
          updates.push('precio = ?');
          values.push(producto.precio);
        }
        if (producto.cantInventario !== undefined) {
          updates.push('cantInventario = ?');
          values.push(producto.cantInventario);
        }
        if (producto.fkModelo !== undefined) {
          updates.push('fkModelo = ?');
          values.push(producto.fkModelo);
        }
        if (producto.fkSubCategoria !== undefined) {
          updates.push('fkSubCategoria = ?');
          values.push(producto.fkSubCategoria);
        }
        if (producto.estatus !== undefined) {
          updates.push('estatus = ?');
          values.push(producto.estatus);
        }
  
        // Si no hay nada que actualizar, retornar false
        if (updates.length === 0) {
          return false;
        }
  
        query += updates.join(', ') + ' WHERE idProducto = ?';
        values.push(id);
  
        const [result] = await pool.query(query, values);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar producto con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar un producto (desactivarlo)
    delete: async (id: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('UPDATE productos SET estatus = ? WHERE idProducto = ?', ['INACTIVO', id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar producto con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Buscar productos
    search: async (term: string): Promise<ProductoConDetalles[]> => {
      try {
        const searchTerm = `%${term}%`;
        const [rows] = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkModelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fkSubCategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE (p.nombreProducto LIKE ? OR p.descProducto LIKE ? OR m.descMarca LIKE ? OR 
                 mo.descModelo LIKE ? OR c.descCategoria LIKE ? OR s.descSubCategoria LIKE ?)
          AND p.estatus = 'ACTIVO'
        `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]);
        
        return rows as ProductoConDetalles[];
      } catch (error) {
        console.error(`Error al buscar productos con término "${term}":`, error);
        throw error;
      }
    }
  };