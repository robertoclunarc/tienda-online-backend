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
        const [rows] = await pool.query(`
          SELECT * FROM ofertas 
          WHERE estatusOferta = 'ACTIVO' 
          AND (finOferta IS NULL OR finOferta >= NOW())
          AND (inicioOferta IS NULL OR inicioOferta <= NOW())
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
        const [rows] = await pool.query('SELECT * FROM ofertas ORDER BY finOferta ASC');
        return rows as Oferta[];
      } catch (error) {
        console.error('Error al obtener ofertas:', error);
        throw error;
      }
    },
  
    // Obtener una oferta por ID
    findById: async (id: number): Promise<Oferta | null> => {
      try {
        const [rows] = await pool.query('SELECT * FROM ofertas WHERE idOferta = ?', [id]);
        const ofertas = rows as Oferta[];
        return ofertas.length > 0 ? ofertas[0] : null;
      } catch (error) {
        console.error(`Error al obtener oferta con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Crear una nueva oferta
    create: async (oferta: Oferta): Promise<number> => {
      try {
        const [result] = await pool.query(`
          INSERT INTO ofertas 
          (descOferta, descuento, inicioOferta, finOferta, estatusOferta) 
          VALUES (?, ?, ?, ?, ?)
        `, [
          oferta.descOferta, 
          oferta.descuento, 
          oferta.inicioOferta || new Date(), 
          oferta.finOferta || null, 
          oferta.estatusOferta || 'ACTIVO'
        ]);
        
        const result2 = result as { insertId: number };
        return result2.insertId;
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
  
        if (oferta.descOferta !== undefined) {
          updates.push('descOferta = ?');
          values.push(oferta.descOferta);
        }
        if (oferta.descuento !== undefined) {
          updates.push('descuento = ?');
          values.push(oferta.descuento);
        }
        if (oferta.inicioOferta !== undefined) {
          updates.push('inicioOferta = ?');
          values.push(oferta.inicioOferta);
        }
        if (oferta.finOferta !== undefined) {
          updates.push('finOferta = ?');
          values.push(oferta.finOferta);
        }
        if (oferta.estatusOferta !== undefined) {
          updates.push('estatusOferta = ?');
          values.push(oferta.estatusOferta);
        }
  
        if (updates.length === 0) {
          return false;
        }
  
        query += updates.join(', ') + ' WHERE idOferta = ?';
        values.push(id);
  
        const [result] = await pool.query(query, values);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar oferta con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar una oferta (marcar como inactiva)
    delete: async (id: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('UPDATE ofertas SET estatusOferta = ? WHERE idOferta = ?', ['INACTIVO', id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar oferta con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Obtener productos de una oferta
    getProductosOferta: async (ofertaId: number): Promise<any[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT op.*, p.nombreProducto, p.precio, p.fkSubCategoria
          FROM ofertasproductos op
          JOIN productos p ON op.fkProducto = p.idProducto
          WHERE op.fkOferta = ? AND p.estatus = 'ACTIVO'
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
        const [result] = await pool.query(`
          INSERT INTO ofertasproductos (fkOferta, fkProducto, descuento) 
          VALUES (?, ?, ?)
        `, [
          ofertaProducto.fkOferta,
          ofertaProducto.fkProducto,
          ofertaProducto.descuento
        ]);
        
        const result2 = result as { insertId: number };
        return result2.insertId;
      } catch (error) {
        console.error('Error al añadir producto a oferta:', error);
        throw error;
      }
    },
  
    // Eliminar producto de una oferta
    removeProductoOferta: async (ofertaProductoId: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('DELETE FROM ofertasproductos WHERE idOfertaProducto = ?', [ofertaProductoId]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar producto de oferta ${ofertaProductoId}:`, error);
        throw error;
      }
    }
  };