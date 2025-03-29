export interface Oferta {
  idoferta?: number;
  descoferta: string;
  descuento: string;
  iniciooferta?: Date;
  finoferta?: Date;
  estatusoferta: string;
}

export interface OfertaProducto {
  idofertaproducto?: number;
  fkoferta: number;
  fkproducto: number;
  descuento: string;
}

import pool from '../config/db.config';

export const OfertaModel = {
  // Obtener todas las ofertas activas
  findAllActive: async (): Promise<Oferta[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT * FROM ofertas 
              WHERE estatusoferta = 'ACTIVO' 
              AND (finoferta IS NULL OR finoferta >= CURRENT_TIMESTAMP)
              AND (iniciooferta IS NULL OR iniciooferta <= CURRENT_TIMESTAMP)
              ORDER BY finoferta ASC
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
          const { rows } = await pool.query('SELECT * FROM ofertas ORDER BY finoferta ASC');
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
              'SELECT * FROM ofertas WHERE idoferta = $1', 
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
              (descoferta, descuento, iniciooferta, finoferta, estatusoferta) 
              VALUES ($1, $2, $3, $4, $5)
              RETURNING idoferta
          `, [
              oferta.descoferta, 
              oferta.descuento, 
              oferta.iniciooferta || new Date(), 
              oferta.finoferta || null, 
              oferta.estatusoferta || 'ACTIVO'
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

          if (oferta.descoferta !== undefined) {
              updates.push(`descoferta = $${paramCount}`);
              values.push(oferta.descoferta);
              paramCount++;
          }
          if (oferta.descuento !== undefined) {
              updates.push(`descuento = $${paramCount}`);
              values.push(oferta.descuento);
              paramCount++;
          }
          if (oferta.iniciooferta !== undefined) {
              updates.push(`iniciooferta = $${paramCount}`);
              values.push(oferta.iniciooferta);
              paramCount++;
          }
          if (oferta.finoferta !== undefined) {
              updates.push(`finoferta = $${paramCount}`);
              values.push(oferta.finoferta);
              paramCount++;
          }
          if (oferta.estatusoferta !== undefined) {
              updates.push(`estatusoferta = $${paramCount}`);
              values.push(oferta.estatusoferta);
              paramCount++;
          }

          if (updates.length === 0) {
              return false;
          }

          query += updates.join(', ') + ` WHERE idoferta = $${paramCount}`;
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
              'UPDATE ofertas SET estatusoferta = $1 WHERE idoferta = $2', 
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
              JOIN productos p ON op.fkproducto = p.idProducto
              WHERE op.fkoferta = $1 AND p.estatus = 'ACTIVO'
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
              INSERT INTO ofertasproductos (fkoferta, fkproducto, descuento) 
              VALUES ($1, $2, $3)
              RETURNING idofertaproducto
          `, [
              ofertaProducto.fkoferta,
              ofertaProducto.fkproducto,
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
              'DELETE FROM ofertasproductos WHERE idofertaproducto = $1', 
              [ofertaProductoId]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar producto de oferta ${ofertaProductoId}:`, error);
          throw error;
      }
  }
};