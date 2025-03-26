export interface Oferta {
  idOferta?: number;
  descOferta: string;
  descuento: string;
  inicioOferta?: Date;
  finOferta?: Date;
  estatusOferta: string;
}

export interface OfertaProducto {
  idOfertaProducto?: number;
  fkOferta: number;
  fkProducto: number;
  descuento: string;
}

import pool from '../config/db.config';

export const OfertaModel = {
  // Obtener todas las ofertas activas
  findAllActive: async (): Promise<Oferta[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT * FROM ofertas 
              WHERE estatusOferta = 'ACTIVO' 
              AND (finOferta IS NULL OR finOferta >= CURRENT_TIMESTAMP)
              AND (inicioOferta IS NULL OR inicioOferta <= CURRENT_TIMESTAMP)
              ORDER BY finOferta ASC
          `);
          return rows as Oferta[];
      } catch (error) {
          console.error('Error al obtener ofertas activas:', error);
          throw error;
      }
  },

  // Obtener todas las ofertas
  findAll: async (): Promise<Oferta[]> => {
      try {
          const { rows } = await pool.query('SELECT * FROM ofertas ORDER BY finOferta ASC');
          return rows as Oferta[];
      } catch (error) {
          console.error('Error al obtener ofertas:', error);
          throw error;
      }
  },

  // Obtener una oferta por ID
  findById: async (id: number): Promise<Oferta | null> => {
      try {
          const { rows } = await pool.query(
              'SELECT * FROM ofertas WHERE idOferta = $1', 
              [id]
          );
          return rows.length > 0 ? rows[0] : null;
      } catch (error) {
          console.error(`Error al obtener oferta con ID ${id}:`, error);
          throw error;
      }
  },

  // Crear una nueva oferta
  create: async (oferta: Oferta): Promise<number> => {
      try {
          const { rows } = await pool.query(`
              INSERT INTO ofertas 
              (descOferta, descuento, inicioOferta, finOferta, estatusOferta) 
              VALUES ($1, $2, $3, $4, $5)
              RETURNING idOferta
          `, [
              oferta.descOferta, 
              oferta.descuento, 
              oferta.inicioOferta || new Date(), 
              oferta.finOferta || null, 
              oferta.estatusOferta || 'ACTIVO'
          ]);
          
          return rows[0].idoferta; // PostgreSQL devuelve en minúsculas
      } catch (error) {
          console.error('Error al crear oferta:', error);
          throw error;
      }
  },

  // Actualizar una oferta
  update: async (id: number, oferta: Partial<Oferta>): Promise<boolean> => {
      try {
          let query = 'UPDATE ofertas SET ';
          const updates: string[] = [];
          const values: any[] = [];
          let paramCount = 1;

          if (oferta.descOferta !== undefined) {
              updates.push(`descOferta = $${paramCount}`);
              values.push(oferta.descOferta);
              paramCount++;
          }
          if (oferta.descuento !== undefined) {
              updates.push(`descuento = $${paramCount}`);
              values.push(oferta.descuento);
              paramCount++;
          }
          if (oferta.inicioOferta !== undefined) {
              updates.push(`inicioOferta = $${paramCount}`);
              values.push(oferta.inicioOferta);
              paramCount++;
          }
          if (oferta.finOferta !== undefined) {
              updates.push(`finOferta = $${paramCount}`);
              values.push(oferta.finOferta);
              paramCount++;
          }
          if (oferta.estatusOferta !== undefined) {
              updates.push(`estatusOferta = $${paramCount}`);
              values.push(oferta.estatusOferta);
              paramCount++;
          }

          if (updates.length === 0) {
              return false;
          }

          query += updates.join(', ') + ` WHERE idOferta = $${paramCount}`;
          values.push(id);

          const { rowCount } = await pool.query(query, values);
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar oferta con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar una oferta (marcar como inactiva)
  delete: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'UPDATE ofertas SET estatusOferta = $1 WHERE idOferta = $2', 
              ['INACTIVO', id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar oferta con ID ${id}:`, error);
          throw error;
      }
  },

  // Obtener productos de una oferta
  getProductosOferta: async (ofertaId: number): Promise<any[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT op.*, p.nombreProducto, p.precio, p.fkSubCategoria
              FROM ofertasproductos op
              JOIN productos p ON op.fkProducto = p.idProducto
              WHERE op.fkOferta = $1 AND p.estatus = 'ACTIVO'
          `, [ofertaId]);
          
          return rows as any[];
      } catch (error) {
          console.error(`Error al obtener productos de oferta ${ofertaId}:`, error);
          throw error;
      }
  },

  // Añadir producto a una oferta
  addProductoOferta: async (ofertaProducto: OfertaProducto): Promise<number> => {
      try {
          const { rows } = await pool.query(`
              INSERT INTO ofertasproductos (fkOferta, fkProducto, descuento) 
              VALUES ($1, $2, $3)
              RETURNING idOfertaProducto
          `, [
              ofertaProducto.fkOferta,
              ofertaProducto.fkProducto,
              ofertaProducto.descuento
          ]);
          
          return rows[0].idofertaproducto;
      } catch (error) {
          console.error('Error al añadir producto a oferta:', error);
          throw error;
      }
  },

  // Eliminar producto de una oferta
  removeProductoOferta: async (ofertaProductoId: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'DELETE FROM ofertasproductos WHERE idOfertaProducto = $1', 
              [ofertaProductoId]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar producto de oferta ${ofertaProductoId}:`, error);
          throw error;
      }
  }
};