export interface Contacto {
  idcontacto?: number;
  nombrecontacto: string;
  tlfcontacto: string | null;
  emailcontacto: string | null;
  estatuscontacto: string;
}

import pool from '../config/db.config';

export const ContactoModel = {
  // Obtener todos los contactos activos
  findAllActive: async (): Promise<Contacto[]> => {
      try {
          const { rows } = await pool.query(`
              SELECT * FROM contactos 
              WHERE estatuscontacto = 'ACTIVO'
              ORDER BY nombrecontacto
          `);
          return rows as Contacto[];
      } catch (error) {
          console.error('Error al obtener contactos activos:', error);
          throw error;
      }
  },

  // Obtener todos los contactos
  findAll: async (): Promise<Contacto[]> => {
      try {
          const { rows } = await pool.query('SELECT * FROM contactos ORDER BY nombrecontacto');
          return rows as Contacto[];
      } catch (error) {
          console.error('Error al obtener contactos:', error);
          throw error;
      }
  },

  // Obtener un contacto por ID
  findById: async (id: number): Promise<Contacto | null> => {
      try {
          const { rows } = await pool.query('SELECT * FROM contactos WHERE idcontacto = $1', [id]);
          return rows.length > 0 ? rows[0] : null;
      } catch (error) {
          console.error(`Error al obtener contacto con ID ${id}:`, error);
          throw error;
      }
  },

  // Crear un nuevo contacto
  create: async (contacto: Contacto): Promise<number> => {
      try {
          const { rows } = await pool.query(`
              INSERT INTO contactos 
              (nombrecontacto, tlfcontacto, emailcontacto, estatuscontacto) 
              VALUES ($1, $2, $3, $4)
              RETURNING idcontacto
          `, [
              contacto.nombrecontacto,
              contacto.tlfcontacto,
              contacto.emailcontacto,
              contacto.estatuscontacto || 'ACTIVO'
          ]);
          
          return rows[0].idcontacto; // PostgreSQL devuelve en minúsculas
      } catch (error) {
          console.error('Error al crear contacto:', error);
          throw error;
      }
  },

  // Actualizar un contacto
  update: async (id: number, contacto: Partial<Contacto>): Promise<boolean> => {
      try {
          let query = 'UPDATE contactos SET ';
          const updates: string[] = [];
          const values: any[] = [];
          let paramCount = 1;

          if (contacto.nombrecontacto !== undefined) {
              updates.push(`nombrecontacto = $${paramCount}`);
              values.push(contacto.nombrecontacto);
              paramCount++;
          }
          if (contacto.tlfcontacto !== undefined) {
              updates.push(`tlfcontacto = $${paramCount}`);
              values.push(contacto.tlfcontacto);
              paramCount++;
          }
          if (contacto.emailcontacto !== undefined) {
              updates.push(`emailcontacto = $${paramCount}`);
              values.push(contacto.emailcontacto);
              paramCount++;
          }
          if (contacto.estatuscontacto !== undefined) {
              updates.push(`estatuscontacto = $${paramCount}`);
              values.push(contacto.estatuscontacto);
              paramCount++;
          }

          if (updates.length === 0) {
              return false;
          }

          query += updates.join(', ') + ` WHERE idcontacto = $${paramCount}`;
          values.push(id);

          const { rowCount } = await pool.query(query, values);
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al actualizar contacto con ID ${id}:`, error);
          throw error;
      }
  },

  // Eliminar un contacto (cambiar estatus a INACTIVO)
  delete: async (id: number): Promise<boolean> => {
      try {
          const { rowCount } = await pool.query(
              'UPDATE contactos SET estatuscontacto = $1 WHERE idcontacto = $2', 
              ['INACTIVO', id]
          );
          return rowCount !== null && rowCount > 0;
      } catch (error) {
          console.error(`Error al eliminar contacto con ID ${id}:`, error);
          throw error;
      }
  }
};