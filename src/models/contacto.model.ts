export interface Contacto {
    idContacto?: number;
    nombreContacto: string;
    tlfContacto: string | null;
    emailContacto: string | null;
    estatusContacto: string;
  }
  
  import pool from '../config/db.config';
  
  export const ContactoModel = {
    // Obtener todos los contactos activos
    findAllActive: async (): Promise<Contacto[]> => {
      try {
        const [rows] = await pool.query(`
          SELECT * FROM contactos 
          WHERE estatusContacto = 'ACTIVO'
          ORDER BY nombreContacto
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
        const [rows] = await pool.query('SELECT * FROM contactos ORDER BY nombreContacto');
        return rows as Contacto[];
      } catch (error) {
        console.error('Error al obtener contactos:', error);
        throw error;
      }
    },
  
    // Obtener un contacto por ID
    findById: async (id: number): Promise<Contacto | null> => {
      try {
        const [rows] = await pool.query('SELECT * FROM contactos WHERE idContacto = ?', [id]);
        const contactos = rows as Contacto[];
        return contactos.length > 0 ? contactos[0] : null;
      } catch (error) {
        console.error(`Error al obtener contacto con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Crear un nuevo contacto
    create: async (contacto: Contacto): Promise<number> => {
      try {
        const [result] = await pool.query(`
          INSERT INTO contactos 
          (nombreContacto, tlfContacto, emailContacto, estatusContacto) 
          VALUES (?, ?, ?, ?)
        `, [
          contacto.nombreContacto,
          contacto.tlfContacto,
          contacto.emailContacto,
          contacto.estatusContacto || 'ACTIVO'
        ]);
        
        const result2 = result as { insertId: number };
        return result2.insertId;
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
  
        if (contacto.nombreContacto !== undefined) {
          updates.push('nombreContacto = ?');
          values.push(contacto.nombreContacto);
        }
        if (contacto.tlfContacto !== undefined) {
          updates.push('tlfContacto = ?');
          values.push(contacto.tlfContacto);
        }
        if (contacto.emailContacto !== undefined) {
          updates.push('emailContacto = ?');
          values.push(contacto.emailContacto);
        }
        if (contacto.estatusContacto !== undefined) {
          updates.push('estatusContacto = ?');
          values.push(contacto.estatusContacto);
        }
  
        if (updates.length === 0) {
          return false;
        }
  
        query += updates.join(', ') + ' WHERE idContacto = ?';
        values.push(id);
  
        const [result] = await pool.query(query, values);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al actualizar contacto con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar un contacto (cambiar estatus a INACTIVO)
    delete: async (id: number): Promise<boolean> => {
      try {
        const [result] = await pool.query('UPDATE contactos SET estatusContacto = ? WHERE idContacto = ?', ['INACTIVO', id]);
        const { affectedRows } = result as { affectedRows: number };
        return affectedRows > 0;
      } catch (error) {
        console.error(`Error al eliminar contacto con ID ${id}:`, error);
        throw error;
      }
    }
  };