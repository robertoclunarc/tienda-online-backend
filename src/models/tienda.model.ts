export interface Tienda {
    idTienda?: number;
    descTienda: string;
    direccionTienda: string | null;
    tlfTienda: string | null;
    encargado: string | null;
    email: string | null;
    estatus: string;
  }
  
  export interface TiendaProducto {
    idTiendaProducto?: number;
    fkTienda: number;
    fkProducto: number;
    canttProducto: number;
    precioProducto: string;
  }
  
  import pool from '../config/db.config';
  
  export const TiendaModel = {
    // Obtener todas las tiendas activas
    findAllActive: async (): Promise<Tienda[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT * FROM tiendas 
          WHERE estatus = 'ACTIVO'
          ORDER BY descTienda
        `);
        return rows as Tienda[];
      } catch (error) {
        console.error('Error al obtener tiendas activas:', error);
        throw error;
      }
    },
  
    // Obtener todas las tiendas
    findAll: async (): Promise<Tienda[]> => {
      try {
        const [rows] = await pool.query('SELECT * FROM tiendas ORDER BY descTienda');
        return rows as Tienda[];
      } catch (error) {
        console.error('Error al obtener tiendas:', error);
        throw error;
      }
    },
  
    // Obtener una tienda por ID
    findById: async (id: number): Promise<Tienda | null> => {
      try {
        const [rows] = await pool.query('SELECT * FROM tiendas WHERE idTienda = ?', [id]);
        const tiendas = rows as Tienda[];
        return tiendas.length > 0 ? tiendas[0] : null;
      } catch (error) {
        console.error(`Error al obtener tienda con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Crear una nueva tienda
    create: async (tienda: Tienda): Promise<number> => {
      try {
        const [result] = await pool.query(`
          INSERT INTO tiendas 
          (descTienda, direccionTienda, tlfTienda, encargado, email, estatus) 
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          tienda.descTienda,
          tienda.direccionTienda,
          tienda.tlfTienda,
          tienda.encargado,
          tienda.email,
          tienda.estatus || 'ACTIVO'
        ]);
        
        const result2 = result as { insertId: number };
        return result2.insertId;
      } catch (error) {
        console.error('Error al crear tienda:', error);
        throw error;
      }
    },
  
    // Actualizar una tienda
    update: async (id: number, tienda: Partial<Tienda>): Promise<boolean> => {
      try {
        let query = 'UPDATE tiendas SET ';
        const updates: string[] = [];
        const values: any[] = [];
  
        if (tienda.descTienda !== undefined) {
          updates.push('descTienda = ?');
          values.push(tienda.descTienda);
        }
        if (tienda.direccionTienda !== undefined) {
          updates.push('direccionTienda = ?');
          values.push(tienda.direccionTienda);
        }
        if (tienda.tlfTienda !== undefined) {
          updates.push('tlfTienda = ?');
          values.push(tienda.tlfTienda);
        }
        if (tienda.encargado !== undefined) {
          updates.push('encargado = ?');
          values.push(tienda.encargado);
        }
        if (tienda.email !== undefined) {
          updates.push('email = ?');
          values.push(tienda.email);
        }
        if (tienda.estatus !== undefined) {
          updates.push('estatus = ?');
          values.push(tienda.estatus);
        }
  
        if (updates.length === 0) {
          return false;
        }
  
        query += updates.join(', ') + ' WHERE idTienda = ?';
        values.push(id);
  
        const [result] = await pool.query(query, values);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar tienda con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar una tienda (cambiar estatus a INACTIVO)
    delete: async (id: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('UPDATE tiendas SET estatus = ? WHERE idTienda = ?', ['INACTIVO', id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar tienda con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Obtener productos de una tienda
    getProductosTienda: async (tiendaId: number): Promise<any[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT tp.*, p.nombreProducto, p.descProducto
          FROM tiendasproductos tp
          JOIN productos p ON tp.fkProducto = p.idProducto
          WHERE tp.fkTienda = ? AND p.estatus = 'ACTIVO'
        `, [tiendaId]);
        
        return rows as any[];
      } catch (error) {
        console.error(`Error al obtener productos de tienda ${tiendaId}:`, error);
        throw error;
      }
    },
  
    // Añadir producto a una tienda
    addProductoTienda: async (tiendaProducto: TiendaProducto): Promise<number> => {
      try {
        // Verificar si el producto ya está en la tienda
        const [existingRows] = await pool.query(`
          SELECT * FROM tiendasproductos 
          WHERE fkTienda = ? AND fkProducto = ?
        `, [tiendaProducto.fkTienda, tiendaProducto.fkProducto]);
        
        const existingProducts = existingRows as TiendaProducto[];
        
        if (existingProducts.length > 0) {
          // Actualizar cantidad y precio
          await pool.query(`
            UPDATE tiendasproductos 
            SET canttProducto = ?, precioProducto = ? 
            WHERE idTiendaProducto = ?
          `, [tiendaProducto.canttProducto, tiendaProducto.precioProducto, existingProducts[0].idTiendaProducto]);
          
          return existingProducts[0].idTiendaProducto!;
        }
        
        // Insertar nuevo producto en tienda
        const [result] = await pool.query(`
          INSERT INTO tiendasproductos 
          (fkTienda, fkProducto, canttProducto, precioProducto) 
          VALUES (?, ?, ?, ?)
        `, [
          tiendaProducto.fkTienda,
          tiendaProducto.fkProducto,
          tiendaProducto.canttProducto,
          tiendaProducto.precioProducto
        ]);
        
        const result2 = result as { insertId: number };
        return result2.insertId;
      } catch (error) {
        console.error('Error al añadir producto a tienda:', error);
        throw error;
      }
    },
  
    // Actualizar cantidad y precio de un producto en una tienda
    updateProductoTienda: async (id: number, cantidad: number, precio: string): Promise<boolean> => {
      try {
        const [result] = await pool.query(`
          UPDATE tiendasproductos 
          SET canttProducto = ?, precioProducto = ? 
          WHERE idTiendaProducto = ?
        `, [cantidad, precio, id]);
        
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar producto de tienda con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar un producto de una tienda
    removeProductoTienda: async (id: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('DELETE FROM tiendasproductos WHERE idTiendaProducto = ?', [id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar producto de tienda con ID ${id}:`, error);
        throw error;
      }
    }
  };