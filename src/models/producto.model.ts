// Interfaces para los modelos de datos
export interface Producto {
    idproducto?: number;
    nombreproducto: string;
    descproducto?: string;
    precio: string;
    cantinventario: number;
    fkmodelo: number;
    fksubcategoria: number;
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
        const result = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE p.estatus = 'ACTIVO'
          ORDER BY p.idproducto DESC
        `);
        return result.rows as ProductoConDetalles[];
      } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
      }
    },
  
    // Obtener productos destacados
    findFeatured: async (limit: number = 8): Promise<ProductoConDetalles[]> => {
      try {
        const result = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE p.estatus = 'ACTIVO'
          ORDER BY p.idproducto DESC
          LIMIT $1
        `, [limit]);
        return result.rows as ProductoConDetalles[];
      } catch (error) {
        console.error('Error al obtener productos destacados:', error);
        throw error;
      }
    },
  
    // Obtener un producto por ID
    findById: async (id: number): Promise<ProductoConDetalles | null> => {
      try {
        const result = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE p.idproducto = $1 AND p.estatus = 'ACTIVO'
        `, [id]);
        
        const products = result.rows as ProductoConDetalles[];
        return products.length > 0 ? products[0] : null;
      } catch (error) {
        console.error(`Error al obtener producto con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Obtener productos por categoría
    findByCategory: async (categoryId: number): Promise<ProductoConDetalles[]> => {
      try {
        const result = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE c.idCategoria = $1 AND p.estatus = 'ACTIVO'
        `, [categoryId]);
        return result.rows as ProductoConDetalles[];
      } catch (error) {
        console.error(`Error al obtener productos por categoría ${categoryId}:`, error);
        throw error;
      }
    },
  
    // Obtener productos por subcategoría
    findBySubcategory: async (subcategoryId: number): Promise<ProductoConDetalles[]> => {
      try {
        const result = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE p.fksubcategoria = $1 AND p.estatus = 'ACTIVO'
        `, [subcategoryId]);
        return result.rows as ProductoConDetalles[];
      } catch (error) {
        console.error(`Error al obtener productos por subcategoría ${subcategoryId}:`, error);
        throw error;
      }
    },
  
    // Crear un nuevo producto
    create: async (producto: Producto): Promise<number> => {
      try {
        const result = await pool.query(`
          INSERT INTO productos 
        (nombreproducto, descproducto, precio, cantinventario, fkmodelo, fksubcategoria, estatus)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING idproducto
        `, [
          producto.nombreproducto, 
          producto.descproducto || null, 
          producto.precio, 
          producto.cantinventario, 
          producto.fkmodelo, 
          producto.fksubcategoria, 
          producto.estatus || 'ACTIVO'
        ]);
        
        const result2 = result.rows[0];
        return result2.idproducto;
      } catch (error) {
        console.error('Error al crear producto:', error);
        throw error;
      }
    },
  
    // Actualizar un producto
    update: async (id: number, producto: Partial<Producto>): Promise<boolean> => {
      try {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCounter = 1; // Contador para los parámetros posicionales
  
        // Costruimos dinámicamente la consulta basada en los campos que se proporcionan
        if (producto.nombreproducto !== undefined) {
          updates.push(`nombreproducto = $${paramCounter++}`);
          values.push(producto.nombreproducto);
        }
        if (producto.descproducto !== undefined) {
          updates.push(`descproducto = $${paramCounter++}`);
          values.push(producto.descproducto);
        }
        if (producto.precio !== undefined) {
          updates.push(`precio = $${paramCounter++}`);
          values.push(producto.precio);
        }
        if (producto.cantinventario !== undefined) {
          updates.push(`cantinventario = $${paramCounter++}`);
          values.push(producto.cantinventario);
        }
        if (producto.fkmodelo !== undefined) {
          updates.push(`fkmodelo = $${paramCounter++}`);
          values.push(producto.fkmodelo);
        }
        if (producto.fksubcategoria !== undefined) {
          updates.push(`fksubcategoria = $${paramCounter++}`);
          values.push(producto.fksubcategoria);
        }
        if (producto.estatus !== undefined) {
          updates.push(`estatus = $${paramCounter++}`);
          values.push(producto.estatus);
        }

        values.push(id);
  
        // Si no hay nada que actualizar, retornar false
        if (updates.length === 0) {
          return false;
        }
  
        const query = `
        UPDATE productos 
        SET ${updates.join(', ')} 
        WHERE idproducto = $${paramCounter}
      `;
  
        const result = await pool.query(query, values);
        const affectedRows = result.rowCount || 0;
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar producto con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar un producto (desactivarlo)
    delete: async (id: number): Promise<boolean> => {
      try {
        const result = await pool.query('UPDATE productos SET estatus = $1 WHERE idproducto = $2', ['INACTIVO', id]);
        const affectedRows  = result.rowCount || 0;
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
        const rows = await pool.query(`
          SELECT p.*, m.descMarca as nombreMarca, mo.descModelo as nombreModelo, 
                 c.descCategoria as nombreCategoria, s.descSubCategoria as nombreSubCategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idModelo
          LEFT JOIN marcas m ON mo.fkMarca = m.idMarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idSubCategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idCategoria
          WHERE (p.nombreproducto LIKE $1 OR p.descproducto LIKE $2 OR m.descMarca LIKE $3 OR 
                 mo.descModelo LIKE $4 OR c.descCategoria LIKE $5 OR s.descSubCategoria LIKE $6)
          AND p.estatus = 'ACTIVO'
        `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]);
        
        return rows.rows as ProductoConDetalles[];
      } catch (error) {
        console.error(`Error al buscar productos con término "${term}":`, error);
        throw error;
      }
    }
  };