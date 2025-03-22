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
        const [rows] = await pool.query(`
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
        const [ventaRows] = await pool.query(`
          SELECT v.*, u.nombreUser as nombreUsuario, u.emailUser as emailUsuario
          FROM ventas v
          JOIN cuentasusuarios u ON v.fkCuentaUser = u.idCuentaUser
          WHERE v.idVenta = ?
        `, [id]);
        
        const ventas = ventaRows as VentaConDetalles[];
        if (ventas.length === 0) {
          return null;
        }
        
        // Obtener detalles de la venta
        const [detallesRows] = await pool.query(`
          SELECT d.*, p.nombreProducto
          FROM detallesventas d
          JOIN productos p ON d.fkProducto = p.idProducto
          WHERE d.fkVenta = ?
        `, [id]);
        
        ventas[0].detalles = detallesRows as DetalleVenta[];
        return ventas[0];
      } catch (error) {
        console.error(`Error al obtener venta con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Obtener ventas de un usuario
    findByUsuario: async (usuarioId: number): Promise<Venta[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT * FROM ventas 
          WHERE fkCuentaUser = ? 
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
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        
        // Insertar la venta
        const [ventaResult] = await connection.query(`
          INSERT INTO ventas 
          (fechaVenta, fkCuentaUser, subTotalVenta, montoTotalVenta, fkFinanciamiento, porcImpuesto, montoImpuesto, estatusVenta) 
          VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?)
        `, [
          venta.fkCuentaUser,
          venta.subTotalVenta || '0.0',
          venta.montoTotalVenta,
          venta.fkFinanciamiento || null,
          venta.porcImpuesto || '0.0',
          venta.montoImpuesto || '0.0',
          venta.estatusVenta || 'ACTIVO'
        ]);
        
        const ventaId = (ventaResult as { insertId: number }).insertId;
        
        // Insertar los detalles de la venta
        for (const detalle of detalles) {
          await connection.query(`
            INSERT INTO detallesventas 
            (fkVenta, fkProducto, precioUnitario, cantProducto, subTotal) 
            VALUES (?, ?, ?, ?, ?)
          `, [
            ventaId,
            detalle.fkProducto,
            detalle.precioUnitario,
            detalle.cantProducto,
            detalle.subTotal
          ]);
          
          // Actualizar inventario
          await connection.query(`
            UPDATE productos 
            SET cantInventario = cantInventario - ? 
            WHERE idProducto = ?
          `, [detalle.cantProducto, detalle.fkProducto]);
        }
        
        // Si llega hasta aquí, confirmar la transacción
        await connection.commit();
        
        return ventaId;
      } catch (error) {
        // Si hay un error, revertir la transacción
        await connection.rollback();
        console.error('Error al crear venta:', error);
        throw error;
      } finally {
        connection.release();
      }
    },
  
    // Actualizar estatus de una venta
    updateEstatus: async (id: number, estatus: string): Promise<boolean> => {
      try {
        const [result] = await pool.query('UPDATE ventas SET estatusVenta = ? WHERE idVenta = ?', [estatus, id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
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
        const [rows] = await pool.query(`
          SELECT 
            COUNT(*) as totalVentas,
            SUM(montoTotalVenta) as montoTotal,
            AVG(montoTotalVenta) as promedioVenta
          FROM ventas
          WHERE estatusVenta = 'ACTIVO'
        `);
        
        const result = rows as [{
          totalVentas: number;
          montoTotal: string;
          promedioVenta: string;
        }];
        
        return {
          totalVentas: result[0].totalVentas || 0,
          montoTotal: result[0].montoTotal || '0.00',
          promedioVenta: result[0].promedioVenta || '0.00'
        };
      } catch (error) {
        console.error('Error al obtener estadísticas de ventas:', error);
        throw error;
      }
    }
  };