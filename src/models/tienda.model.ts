export interface Tienda {
  idtienda?: number;
  desctienda: string;
  direcciontienda: string | null;
  tlftienda: string | null;
  encargado: string | null;
  email: string | null;
  estatus: string;
}

export interface TiendaProducto {
  idtiendaproducto?: number;
  fktienda: number;
  fkproducto: number;
  cantproducto: number;
  precioproducto: string;
}

import pool from '../config/db.config';

export const TiendaModel = {
  // Obtener todas las tiendas activas
  findAllActive: async (): Promise<Tienda[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT * FROM tiendas 
              WHERE estatus = 'ACTIVO'
              ORDER BY desctienda
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
          const { rows } = await pool.query('SELECT * FROM tiendas ORDER BY desctienda');
          return rows as Tienda[];
      } catch (error) {
          console.error('Error al obtener tiendas:', error);
          throw error;
      }
  },

  // Obtener una tienda por ID
  findById: async (id: number): Promise<Tienda | null> => {
      try {
          const { rows } = await pool.query(
              'SELECT * FROM tiendas WHERE idtienda = $1', 
              [id]
          );
          return rows.length > 0 ? rows[0] : null;
      } catch (error) {
          console.error(`Error al obtener tienda con ID ${id}:`, error);
          throw error;
      }
  },

  // Crear una nueva tienda
  create: async (tienda: Tienda): Promise<number> => {
      try {
          const { rows } = await pool.query(`
              INSERT INTO tiendas 
              (desctienda, direcciontienda, tlftienda, encargado, email, estatus) 
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING idtienda
          `, [
              tienda.desctienda,
              tienda.direcciontienda,
              tienda.tlftienda,
              tienda.encargado,
              tienda.email,
              tienda.estatus || 'ACTIVO'
          ]);
          
          return rows[0].idtienda;
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
          let paramCount = 1;

          if (tienda.desctienda !== undefined) {
              updates.push(`desctienda = $${paramCount}`);
              values.push(tienda.desctienda);
              paramCount++;
          }
          if (tienda.direcciontienda !== undefined) {
              updates.push(`direcciontienda = $${paramCount}`);
              values.push(tienda.direcciontienda);
              paramCount++;
          }
          if (tienda.tlftienda !== undefined) {
              updates.push(`tlftienda = $${paramCount}`);
              values.push(tienda.tlftienda);
              paramCount++;
          }
          if (tienda.encargado !== undefined) {
              updates.push(`encargado = $${paramCount}`);
              values.push(tienda.encargado);
              paramCount++;
          }
          if (tienda.email !== undefined) {
              updates.push(`email = $${paramCount}`);
              values.push(tienda.email);
              paramCount++;
          }
          if (tienda.estatus !== undefined) {
              updates.push(`estatus = $${paramCount}`);
              values.push(tienda.estatus);
              paramCount++;
          }

          if (updates.length === 0) {
              return false;
          }

          query += updates.join(', ') + ` WHERE idtienda = $${paramCount}`;
          values.push(id);

          const { rowCount } = await pool.query(query, values);
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar tienda con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar una tienda (cambiar estatus a INACTIVO)
  delete: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'UPDATE tiendas SET estatus = $1 WHERE idtienda = $2', 
              ['INACTIVO', id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar tienda con ID ${id}:`, error);
          throw error;
      }
  },

  // Obtener productos de una tienda
  getProductosTienda: async (tiendaId: number): Promise<any[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT tp.*, p.nombreproducto, p.descproducto
              FROM tiendasproductos tp
              JOIN productos p ON tp.fkproducto = p.idproducto
              WHERE tp.fktienda = $1 AND p.estatus = 'ACTIVO'
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
          const { rows: existingRows } = await pool.query(`
              SELECT * FROM tiendasproductos 
              WHERE fktienda = $1 AND fkproducto = $2
          `, [tiendaProducto.fktienda, tiendaProducto.fkproducto]);
          
          if (existingRows.length > 0) {
              // Actualizar cantidad y precio
              await pool.query(`
                  UPDATE tiendasproductos 
                  SET canttProducto = $1, precioproducto = $2 
                  WHERE idtiendaproducto = $3
              `, [
                  tiendaProducto.cantproducto, 
                  tiendaProducto.precioproducto, 
                  existingRows[0].idtiendaproducto
              ]);
              
              return existingRows[0].idtiendaproducto;
          }
          
          // Insertar nuevo producto en tienda
          const { rows } = await pool.query(`
              INSERT INTO tiendasproductos 
              (fktienda, fkproducto, canttProducto, precioproducto) 
              VALUES ($1, $2, $3, $4)
              RETURNING idtiendaproducto
          `, [
              tiendaProducto.fktienda,
              tiendaProducto.fkproducto,
              tiendaProducto.cantproducto,
              tiendaProducto.precioproducto
          ]);
          
          return rows[0].idtiendaproducto;
      } catch (error) {
          console.error('Error al añadir producto a tienda:', error);
          throw error;
      }
  },

  // Actualizar cantidad y precio de un producto en una tienda
  updateProductoTienda: async (id: number, cantidad: number, precio: string): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(`
              UPDATE tiendasproductos 
              SET canttProducto = $1, precioproducto = $2 
              WHERE idtiendaproducto = $3
          `, [cantidad, precio, id]);
          
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar producto de tienda con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar un producto de una tienda
  removeProductoTienda: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'DELETE FROM tiendasproductos WHERE idtiendaproducto = $1', 
              [id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar producto de tienda con ID ${id}:`, error);
          throw error;
      }
  }
};