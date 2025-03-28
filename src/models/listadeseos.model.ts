export interface ListaDeseos {
  idlista?: number;
  fkcuentaUser: number;
  fkproducto: number;
  fecharegsitro?: Date;
}

export interface ListaDeseosConProducto extends ListaDeseos {
  nombreproducto?: string;
  precio?: string;
  nombrecategoria?: string;
}

import pool from '../config/db.config';

export const ListaDeseosModel = {
  // Obtener lista de deseos de un usuario
  findByUsuario: async (usuarioId: number): Promise<ListaDeseosConProducto[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT l.*, p.nombreProducto, p.precio, cat.descCategoria as nombreCategoria
              FROM listasdedeseos l
              JOIN productos p ON l.fkProducto = p.idProducto
              LEFT JOIN subcategorias s ON p.fkSubCategoria = s.idSubCategoria
              LEFT JOIN categorias cat ON s.fkCategoria = cat.idCategoria
              WHERE l.fkCuentaUser = $1 AND p.estatus = 'ACTIVO'
          `, [usuarioId]);
          return rows as ListaDeseosConProducto[];
      } catch (error) {
          console.error(`Error al obtener lista de deseos del usuario ${usuarioId}:`, error);
          throw error;
      }
  },

  // Verificar si un producto ya está en la lista de deseos del usuario
  existsInWishlist: async (usuarioId: number, productoId: number): Promise<boolean> => {
      try {
          const { rows } = await pool.query(`
              SELECT COUNT(*) as count FROM listasdedeseos 
              WHERE fkCuentaUser = $1 AND fkProducto = $2
          `, [usuarioId, productoId]);
          
          return rows[0].count > 0;
      } catch (error) {
          console.error(`Error al verificar producto ${productoId} en lista de deseos de usuario ${usuarioId}:`, error);
          throw error;
      }
  },

  // Añadir un producto a la lista de deseos
  addToWishlist: async (listaDeseos: ListaDeseos): Promise<number> => {
      try {
          // Verificar si ya existe
          const existe = await ListaDeseosModel.existsInWishlist(listaDeseos.fkcuentaUser, listaDeseos.fkproducto);
          if (existe) {
              throw new Error('El producto ya está en la lista de deseos');
          }
          
          const { rows } = await pool.query(`
              INSERT INTO listasdedeseos 
              (fkCuentaUser, fkProducto) 
              VALUES ($1, $2)
              RETURNING idLista
          `, [listaDeseos.fkcuentaUser, listaDeseos.fkproducto]);
          
          return rows[0].idlista; // PostgreSQL devuelve en minúsculas
      } catch (error) {
          console.error('Error al añadir producto a lista de deseos:', error);
          throw error;
      }
  },

  // Eliminar un producto de la lista de deseos
  removeFromWishlist: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'DELETE FROM listasdedeseos WHERE idLista = $1', 
              [id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar producto de lista de deseos con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar un producto específico de la lista de deseos de un usuario
  removeProductFromWishlist: async (usuarioId: number, productoId: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'DELETE FROM listasdedeseos WHERE fkCuentaUser = $1 AND fkProducto = $2', 
              [usuarioId, productoId]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar producto ${productoId} de lista de deseos de usuario ${usuarioId}:`, error);
          throw error;
      }
  },

  // Limpiar toda la lista de deseos de un usuario
  clearWishlist: async (usuarioId: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'DELETE FROM listasdedeseos WHERE fkCuentaUser = $1', 
              [usuarioId]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al limpiar lista de deseos del usuario ${usuarioId}:`, error);
          throw error;
      }
  }
};