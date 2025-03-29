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
    nombremarca?: string;
    nombremodelo?: string;
    nombrecategoria?: string;
    nombresubcategoria?: string;
  }
  
  import pool from '../config/db.config';
  
  export const ProductoModel = {
    // Obtener todos los productos
    findAll: async (): Promise<ProductoConDetalles[]> => {
      try {
        const result = await pool.query(`
          SELECT p.*, m.descmarca as nombremarca, mo.descmodelo as nombremodelo, 
                 c.desccategoria as nombrecategoria, s.descsubcategoria as nombresubcategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idmodelo
          LEFT JOIN marcas m ON mo.fkmarca = m.idmarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idsubcategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idcategoria
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
          SELECT p.*, m.descmarca as nombremarca, mo.descmodelo as nombremodelo, 
                 c.desccategoria as nombrecategoria, s.descsubcategoria as nombresubcategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idmodelo
          LEFT JOIN marcas m ON mo.fkmarca = m.idmarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idsubcategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idcategoria
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
          SELECT p.*, m.descmarca as nombremarca, mo.descmodelo as nombremodelo, 
                 c.desccategoria as nombrecategoria, s.descsubcategoria as nombresubcategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idmodelo
          LEFT JOIN marcas m ON mo.fkmarca = m.idmarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idsubcategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idcategoria
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
          SELECT p.*, m.descmarca as nombremarca, mo.descmodelo as nombremodelo, 
                 c.desccategoria as nombrecategoria, s.descsubcategoria as nombresubcategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idmodelo
          LEFT JOIN marcas m ON mo.fkmarca = m.idmarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idsubcategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idcategoria
          WHERE c.idcategoria = $1 AND p.estatus = 'ACTIVO'
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
          SELECT p.*, m.descmarca as nombremarca, mo.descmodelo as nombremodelo, 
                 c.desccategoria as nombrecategoria, s.descsubcategoria as nombresubcategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idmodelo
          LEFT JOIN marcas m ON mo.fkmarca = m.idmarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idsubcategoria
          LEFT JOIN categorias c ON s.fkCategoria = c.idcategoria
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
        const searchTerm = `%${term.trim().toLowerCase()}%`;
        const rows = await pool.query(`
          SELECT p.*, m.descmarca as nombremarca, mo.descmodelo as nombremodelo, 
                 c.desccategoria as nombrecategoria, s.descsubcategoria as nombresubcategoria
          FROM productos p
          LEFT JOIN modelos mo ON p.fkmodelo = mo.idmodelo
          LEFT JOIN marcas m ON mo.fkmarca = m.idmarca
          LEFT JOIN subcategorias s ON p.fksubcategoria = s.idsubcategoria
          LEFT JOIN categorias c ON s.fkcategoria = c.idcategoria
          WHERE (LOWER(p.nombreproducto) LIKE $1 OR LOWER(p.descproducto) LIKE $2 OR LOWER(m.descmarca) LIKE $3 OR 
                 LOWER(mo.descmodelo) LIKE $4 OR LOWER(c.desccategoria) LIKE $5 OR LOWER(s.descsubcategoria) LIKE $6)
          AND p.estatus = 'ACTIVO'
        `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]);
        
        return rows.rows as ProductoConDetalles[];
      } catch (error) {
        console.error(`Error al buscar productos con término "${term}":`, error);
        throw error;
      }
    }
  };