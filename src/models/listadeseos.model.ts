export interface ListaDeseos {
  idlista?: number;
  fkcuentauser: number;
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
              SELECT l.*, p.nombreproducto, p.precio, cat.desccategoria as nombrecategoria
              FROM listasdedeseos l
              JOIN productos p ON l.fkproducto = p.idproducto
              LEFT JOIN subcategorias s ON p.fksubcategoria = s.idsubcategoria
              LEFT JOIN categorias cat ON s.fkcategoria = cat.idcategoria
              WHERE l.fkcuentauser = $1 AND p.estatus = 'ACTIVO'
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
              WHERE fkcuentauser = $1 AND fkproducto = $2
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
          const existe = await ListaDeseosModel.existsInWishlist(listaDeseos.fkcuentauser, listaDeseos.fkproducto);
          if (existe) {
              throw new Error('El producto ya está en la lista de deseos');
          }
          
          const { rows } = await pool.query(`
              INSERT INTO listasdedeseos 
              (fkcuentauser, fkproducto) 
              VALUES ($1, $2)
              RETURNING idlista
          `, [listaDeseos.fkcuentauser, listaDeseos.fkproducto]);
          
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
              'DELETE FROM listasdedeseos WHERE idlista = $1', 
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
              'DELETE FROM listasdedeseos WHERE fkcuentauser = $1 AND fkproducto = $2', 
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
              'DELETE FROM listasdedeseos WHERE fkcuentauser = $1', 
              [usuarioId]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al limpiar lista de deseos del usuario ${usuarioId}:`, error);
          throw error;
      }
  }
};