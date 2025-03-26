export interface Carrito {
    idCarrito?: number;
    fkProducto: number;
    cantProducto: number;
    montoTotal: string;
    fkCuentaUser: number;
    estatusCarrito: string;
  }
  
  export interface CarritoConProducto extends Carrito {
    nombreProducto?: string;
    precio?: string;
    nombreCategoria?: string;
  }
  
  import pool from '../config/db.config';
  
  export const CarritoModel = {
    // Obtener todos los items del carrito de un usuario
    findByUsuario: async (usuarioId: number): Promise<CarritoConProducto[]> => {
      try {
        const rows = await pool.query(`
          SELECT c.*, p.nombreProducto, p.precio, cat.descCategoria as nombreCategoria
          FROM carritos c
          JOIN productos p ON c.fkProducto = p.idProducto
          LEFT JOIN subcategorias s ON p.fkSubCategoria = s.idSubCategoria
          LEFT JOIN categorias cat ON s.fkCategoria = cat.idCategoria
          WHERE c.fkCuentaUser = $1 AND c.estatusCarrito = 'ACTIVO'
        `, [usuarioId]);
        return rows.rows as CarritoConProducto[];
      } catch (error) {
        console.error(`Error al obtener carrito del usuario ${usuarioId}:`, error);
        throw error;
      }
    },
  
    // Obtener un item específico del carrito
    findById: async (id: number): Promise<CarritoConProducto | null> => {
      try {
        const rows = await pool.query(`
          SELECT c.*, p.nombreProducto, p.precio, cat.descCategoria as nombreCategoria
          FROM carritos c
          JOIN productos p ON c.fkProducto = p.idProducto
          LEFT JOIN subcategorias s ON p.fkSubCategoria = s.idSubCategoria
          LEFT JOIN categorias cat ON s.fkCategoria = cat.idCategoria
          WHERE c.idCarrito = $1
        `, [id]);
        
        const carritos = rows.rows as CarritoConProducto[];
        return carritos.length > 0 ? carritos[0] : null;
      } catch (error) {
        console.error(`Error al obtener item del carrito con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Verificar si un producto ya está en el carrito del usuario
    findByUsuarioProducto: async (usuarioId: number, productoId: number): Promise<Carrito | null> => {
      try {
        const rows = await pool.query(`
          SELECT * FROM carritos 
          WHERE fkCuentaUser = $1 AND fkProducto = $2 AND estatusCarrito = 'ACTIVO'
        `, [usuarioId, productoId]);
        
        const carritos = rows.rows as Carrito[];
        return carritos.length > 0 ? carritos[0] : null;
      } catch (error) {
        console.error(`Error al verificar producto ${productoId} en carrito de usuario ${usuarioId}:`, error);
        throw error;
      }
    },
  
    // Añadir un producto al carrito
    addToCart: async (carrito: Carrito): Promise<number> => {
      try {
        // Obtener el precio actual del producto
        const productRows = await pool.query('SELECT precio FROM productos WHERE idProducto = $1', [carrito.fkProducto]);
        const productos = productRows.rows as { precio: string }[];
        
        if (productos.length === 0) {
          throw new Error('Producto no encontrado');
        }
        
        const precioProducto = parseFloat(productos[0].precio);
        const montoTotal = (precioProducto * carrito.cantProducto).toFixed(2);
        
        // Verificar si el producto ya está en el carrito
        const itemExistente = await CarritoModel.findByUsuarioProducto(carrito.fkCuentaUser, carrito.fkProducto);
        
        if (itemExistente) {
          // Actualizar cantidad y monto
          const nuevaCantidad = itemExistente.cantProducto + carrito.cantProducto;
          const nuevoMonto = (precioProducto * nuevaCantidad).toFixed(2);
          
          await pool.query(`
            UPDATE carritos 
            SET cantProducto = $1, montoTotal = $2 
            WHERE idCarrito = $3
          `, [nuevaCantidad, nuevoMonto, itemExistente.idCarrito]);
          
          return itemExistente?.idCarrito ?? 0;
        } else {
          // Insertar nuevo item en carrito
          const result = await pool.query(`
            INSERT INTO carritos 
            (fkProducto, cantProducto, montoTotal, fkCuentaUser, estatusCarrito) 
            VALUES ($1, $2, $3, $4, $5)
          `, [
            carrito.fkProducto,
            carrito.cantProducto,
            montoTotal,
            carrito.fkCuentaUser,
            carrito.estatusCarrito || 'ACTIVO'
          ]);
          
          const result2 = result.rows[0];
          return result2.idCarrito;
        }
      } catch (error) {
        console.error('Error al añadir producto al carrito:', error);
        throw error;
      }
    },
  
    // Actualizar cantidad de un producto en el carrito
    updateCartItem: async (id: number, cantidad: number): Promise<boolean> => {
      try {
        // Obtener datos del item del carrito
        const carritoItem = await CarritoModel.findById(id);
        if (!carritoItem) {
          return false;
        }
        
        // Obtener el precio actual del producto
        const productRows = await pool.query('SELECT precio FROM productos WHERE idProducto = 1$', [carritoItem.fkProducto]);
        const productos = productRows.rows;
        
        if (productos.length === 0) {
          throw new Error('Producto no encontrado');
        }
        
        const precioProducto = parseFloat(productos[0].precio);
        const montoTotal = (precioProducto * cantidad).toFixed(2);
        
        // Actualizar cantidad y monto
        const result = await pool.query(`
          UPDATE carritos 
          SET cantProducto = $1, montoTotal = $2 
          WHERE idCarrito = $3
        `, [cantidad, montoTotal, id]);
        
        const  affectedRows  = result.rowCount || 0;
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar item del carrito con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar un item del carrito
    removeFromCart: async (id: number): Promise<boolean> => {
      try {
        const result = await pool.query('DELETE FROM carritos WHERE idCarrito = $1', [id]);
        const affectedRows = result.rowCount || 0;
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar item del carrito con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Limpiar el carrito de un usuario
    clearCart: async (usuarioId: number): Promise<boolean> => {
      try {
        const result = await pool.query('DELETE FROM carritos WHERE fkCuentaUser = $1', [usuarioId]);
        const affectedRows = result.rowCount || 0;
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al limpiar carrito del usuario ${usuarioId}:`, error);
        throw error;
      }
    },
  
    // Obtener total del carrito
    getTotalCarrito: async (usuarioId: number): Promise<{ total: string, cantidadItems: number }> => {
      try {
        const rows = await pool.query(`
          SELECT SUM(montoTotal) as total, COUNT(*) as cantidadItems 
          FROM carritos 
          WHERE fkCuentaUser = $1 AND estatusCarrito = 'ACTIVO'
        `, [usuarioId]);
        
        const result = rows.rows as [{ total: string, cantidadItems: number }];
        return {
          total: result[0].total || '0.00',
          cantidadItems: result[0].cantidadItems || 0
        };
      } catch (error) {
        console.error(`Error al obtener total del carrito para usuario ${usuarioId}:`, error);
        throw error;
      }
    }
  };