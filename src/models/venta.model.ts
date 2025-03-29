export interface Venta {
  idventa?: number;
  fechaventa?: Date;
  fkcuentauser: number;
  subtotalventa?: string;
  montototalventa: string;
  fkfinanciamiento?: number | null;
  porcimpuesto?: string;
  montoimpuesto?: string;
  estatusventa?: string;
}

export interface DetalleVenta {
  iddetalle?: number;
  fkventa: number;
  fkproducto: number;
  preciounitario: string;
  cantproducto: number;
  subtotal: string;
}

export interface VentaConDetalles extends Venta {
  detalles?: DetalleVenta[];
  nombreusuario?: string;
  emailusuario?: string;
}

import pool from '../config/db.config';

export const VentaModel = {
  // Obtener todas las ventas
  findAll: async (): Promise<VentaConDetalles[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT v.*, u.nombreuser as nombreusuario, u.emailuser as emailusuario
              FROM ventas v
              JOIN cuentasusuarios u ON v.fkcuentauser = u.idcuentauser
              ORDER BY v.fechaventa DESC
          `);
          return rows as VentaConDetalles[];
      } catch (error) {
          console.error('Error al obtener ventas:', error);
          throw error;
      }
  },

  // Obtener una venta por ID con sus detalles
  findById: async (id: number): Promise<VentaConDetalles | null> => {
      try {
          // Obtener info de la venta
          const { rows: ventaRows } = await pool.query(`
              SELECT v.*, u.nombreuser as nombreusuario, u.emailuser as emailusuario
              FROM ventas v
              JOIN cuentasusuarios u ON v.fkcuentauser = u.idcuentauser
              WHERE v.idventa = $1
          `, [id]);
          
          if (ventaRows.length === 0) {
              return null;
          }
          
          // Obtener detalles de la venta
          const { rows: detallesRows } = await pool.query(`
              SELECT d.*, p.nombreProducto
              FROM detallesventas d
              JOIN productos p ON d.fkproducto = p.idproducto
              WHERE d.fkventa = $1
          `, [id]);
          
          const venta = ventaRows[0] as VentaConDetalles;
          venta.detalles = detallesRows as DetalleVenta[];
          return venta;
      } catch (error) {
          console.error(`Error al obtener venta con ID ${id}:`, error);
          throw error;
      }
  },

  // Obtener ventas de un usuario
  findByUsuario: async (usuarioId: number): Promise<Venta[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT * FROM ventas 
              WHERE fkcuentauser = $1 
              ORDER BY fechaventa DESC
          `, [usuarioId]);
          return rows as Venta[];
      } catch (error) {
          console.error(`Error al obtener ventas del usuario ${usuarioId}:`, error);
          throw error;
      }
  },

  // Crear una nueva venta
  create: async (venta: Venta, detalles: Omit<DetalleVenta, 'iddetalle' | 'fkventa'>[]): Promise<number> => {
      const client = await pool.connect();
      
      try {
          await client.query('BEGIN');
          
          // Insertar la venta
          const { rows: ventaRows } = await client.query(`
              INSERT INTO ventas 
              (fechaventa, fkcuentauser, subtotalventa, montototalventa, fkfinanciamiento, porcimpuesto, montoimpuesto, estatusventa) 
              VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7)
              RETURNING idventa
          `, [
              venta.fkcuentauser,
              venta.subtotalventa || '0.0',
              venta.montototalventa,
              venta.fkfinanciamiento || null,
              venta.porcimpuesto || '0.0',
              venta.montoimpuesto || '0.0',
              venta.estatusventa || 'ACTIVO'
          ]);
          
          const ventaId = ventaRows[0].idventa;
          
          // Insertar los detalles de la venta
          for (const detalle of detalles) {
              await client.query(`
                  INSERT INTO detallesventas 
                  (fkventa, fkproducto, preciounitario, cantproducto, subtotal) 
                  VALUES ($1, $2, $3, $4, $5)
              `, [
                  ventaId,
                  detalle.fkproducto,
                  detalle.preciounitario,
                  detalle.cantproducto,
                  detalle.subtotal
              ]);
              
              // Actualizar inventario
              await client.query(`
                  UPDATE productos 
                  SET cantinventario = cantinventario - $1 
                  WHERE idproducto = $2
              `, [detalle.cantproducto, detalle.fkproducto]);
          }
          
          await client.query('COMMIT');
          return ventaId;
      } catch (error) {
          await client.query('ROLLBACK');
          console.error('Error al crear venta:', error);
          throw error;
      } finally {
          client.release();
      }
  },

  // Actualizar estatus de una venta
  updateEstatus: async (id: number, estatus: string): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'UPDATE ventas SET estatusventa = $1 WHERE idventa = $2', 
              [estatus, id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar estatus de venta con ID ${id}:`, error);
          throw error;
      }
  },

  // Obtener estadísticas de ventas
  getEstadisticas: async (): Promise<{
      totalventas: number;
      montototal: string;
      promedioventa: string;
  }> => {
      try {
          const { rows } = await pool.query(`
              SELECT 
                  COUNT(*) as totalventas,
                  SUM(montototalventa) as montototal,
                  AVG(montototalventa) as promedioventa
              FROM ventas
              WHERE estatusventa = 'ACTIVO'
          `);
          
          const result = rows[0] as {
              totalventas: number;
              montototal: string;
              promedioventa: string;
          };
          
          return {
              totalventas: result.totalventas || 0,
              montototal: result.montototal || '0.00',
              promedioventa: result.promedioventa || '0.00'
          };
      } catch (error) {
          console.error('Error al obtener estadísticas de ventas:', error);
          throw error;
      }
  }
};