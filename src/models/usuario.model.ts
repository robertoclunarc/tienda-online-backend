export interface Venta {
  idVenta?: number;
  fechaVenta?: Date;
  fkCuentaUser: number;
  subTotalVenta?: string;
  montoTotalVenta: string;
  fkFinanciamiento?: number | null;
  porcImpuesto?: string;
  montoImpuesto?: string;
  estatusVenta?: string;
}

export interface DetalleVenta {
  idDetalle?: number;
  fkVenta: number;
  fkProducto: number;
  precioUnitario: string;
  cantProducto: number;
  subTotal: string;
}

export interface VentaConDetalles extends Venta {
  detalles?: DetalleVenta[];
  nombreUsuario?: string;
  emailUsuario?: string;
}

import pool from '../config/db.config';

export const VentaModel = {
  // Obtener todas las ventas
  findAll: async (): Promise<VentaConDetalles[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT v.*, u.nombreUser as nombreUsuario, u.emailUser as emailUsuario
              FROM ventas v
              JOIN cuentasusuarios u ON v.fkCuentaUser = u.idCuentaUser
              ORDER BY v.fechaVenta DESC
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
              SELECT v.*, u.nombreUser as nombreUsuario, u.emailUser as emailUsuario
              FROM ventas v
              JOIN cuentasusuarios u ON v.fkCuentaUser = u.idCuentaUser
              WHERE v.idVenta = $1
          `, [id]);
          
          if (ventaRows.length === 0) {
              return null;
          }
          
          // Obtener detalles de la venta
          const { rows: detallesRows } = await pool.query(`
              SELECT d.*, p.nombreProducto
              FROM detallesventas d
              JOIN productos p ON d.fkProducto = p.idProducto
              WHERE d.fkVenta = $1
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
              WHERE fkCuentaUser = $1 
              ORDER BY fechaVenta DESC
          `, [usuarioId]);
          return rows as Venta[];
      } catch (error) {
          console.error(`Error al obtener ventas del usuario ${usuarioId}:`, error);
          throw error;
      }
  },

  // Crear una nueva venta
  create: async (venta: Venta, detalles: Omit<DetalleVenta, 'idDetalle' | 'fkVenta'>[]): Promise<number> => {
      const client = await pool.connect();
      
      try {
          await client.query('BEGIN');
          
          // Insertar la venta
          const { rows: ventaRows } = await client.query(`
              INSERT INTO ventas 
              (fechaVenta, fkCuentaUser, subTotalVenta, montoTotalVenta, fkFinanciamiento, porcImpuesto, montoImpuesto, estatusVenta) 
              VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7)
              RETURNING idVenta
          `, [
              venta.fkCuentaUser,
              venta.subTotalVenta || '0.0',
              venta.montoTotalVenta,
              venta.fkFinanciamiento || null,
              venta.porcImpuesto || '0.0',
              venta.montoImpuesto || '0.0',
              venta.estatusVenta || 'ACTIVO'
          ]);
          
          const ventaId = ventaRows[0].idventa;
          
          // Insertar los detalles de la venta
          for (const detalle of detalles) {
              await client.query(`
                  INSERT INTO detallesventas 
                  (fkVenta, fkProducto, precioUnitario, cantProducto, subTotal) 
                  VALUES ($1, $2, $3, $4, $5)
              `, [
                  ventaId,
                  detalle.fkProducto,
                  detalle.precioUnitario,
                  detalle.cantProducto,
                  detalle.subTotal
              ]);
              
              // Actualizar inventario
              await client.query(`
                  UPDATE productos 
                  SET cantInventario = cantInventario - $1 
                  WHERE idProducto = $2
              `, [detalle.cantProducto, detalle.fkProducto]);
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
              'UPDATE ventas SET estatusVenta = $1 WHERE idVenta = $2', 
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
      totalVentas: number;
      montoTotal: string;
      promedioVenta: string;
  }> => {
      try {
          const { rows } = await pool.query(`
              SELECT 
                  COUNT(*) as totalVentas,
                  SUM(montoTotalVenta) as montoTotal,
                  AVG(montoTotalVenta) as promedioVenta
              FROM ventas
              WHERE estatusVenta = 'ACTIVO'
          `);
          
          const result = rows[0] as {
              totalventas: number;
              montototal: string;
              promedioventa: string;
          };
          
          return {
              totalVentas: result.totalventas || 0,
              montoTotal: result.montototal || '0.00',
              promedioVenta: result.promedioventa || '0.00'
          };
      } catch (error) {
          console.error('Error al obtener estadísticas de ventas:', error);
          throw error;
      }
  }
};