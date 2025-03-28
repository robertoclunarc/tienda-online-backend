export interface Usuario {
    idcuentauser?: number;
    nombreuser: string | null;
    emailuser: string;
    tlfuser: string | null;
    passw: string;
    estatus: string;
    roleuser?: string; // Rol del usuario (admin, user, etc.)
  }
  
  // Omitir contraseña para respuestas
  export type UsuarioSinPassword = Omit<Usuario, 'passw'>;
  
  import pool from '../config/db.config';
  import bcrypt from 'bcryptjs';
  import { AuthService } from '../services/auth.service';
  
  export const UsuarioModel = {
    // Obtener todos los usuarios
    findAll: async (): Promise<UsuarioSinPassword[]> => {
      try {
        const { rows } = await pool.query(`
          SELECT idcuentauser, nombreuser, emailuser, tlfuser, estatus, roleuser 
          FROM cuentasusuarios
        `);
        return rows as UsuarioSinPassword[];
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
      }
    },
  
    // Obtener un usuario por ID
    findById: async (id: number): Promise<Usuario | null> => {
      try {
        const { rows } = await pool.query(
          'SELECT * FROM cuentasusuarios WHERE idcuentauser = $1', 
          [id]
        );
        return rows.length > 0 ? rows[0] : null;
      } catch (error) {
        console.error(`Error al obtener usuario con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Encontrar usuario por email (incluye password para autenticación)
    findByEmail: async (email: string): Promise<Usuario | null> => {
      try {
        const { rows } = await pool.query(
          'SELECT * FROM cuentasusuarios WHERE emailuser = $1', 
          [email]
        );
        return rows.length > 0 ? rows[0] : null;
      } catch (error) {
        console.error(`Error al buscar usuario por email ${email}:`, error);
        throw error;
      }
    },
  
    // Crear un nuevo usuario
    register: async (usuario: Usuario): Promise<number> => {
      try {
        // Hash de la contraseña
        const hashedPassword = await AuthService.hashPassword(usuario.passw);
        
        const { rows } = await pool.query(
          `INSERT INTO cuentasusuarios 
           (nombreuser, emailuser, tlfuser, passw, roleuser, estatus) 
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING idcuentauser`,
          [
            usuario.nombreuser,
            usuario.emailuser,
            usuario.tlfuser,
            hashedPassword,
            usuario.roleuser || 'user', // Por defecto, rol de usuario normal
            usuario.estatus || 'ACTIVO'
          ]
        );
        
        return rows[0].idcuentauser;
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
      }
    },
  
    // Cambiar contraseña de usuario
    changePassword: async (userId: number, newPassword: string): Promise<boolean> => {
      try {
        // Hash de la nueva contraseña
        const hashedPassword = await AuthService.hashPassword(newPassword);
        
        const { rowCount } = await pool.query(
          'UPDATE cuentasusuarios SET passw = $1 WHERE idcuentauser = $2',
          [hashedPassword, userId]
        );
        
        return rowCount !== null && rowCount > 0;
      } catch (error) {
        console.error(`Error al cambiar contraseña del usuario ${userId}:`, error);
        throw error;
      }
    },
  
    // Actualizar un usuario
    update: async (id: number, usuario: Partial<Usuario>): Promise<boolean> => {
      try {
        let query = 'UPDATE cuentasusuarios SET ';
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;
  
        // Construimos dinámicamente la consulta
        if (usuario.nombreuser !== undefined) {
          updates.push(`nombreuser = $${paramCount}`);
          values.push(usuario.nombreuser);
          paramCount++;
        }
        if (usuario.emailuser !== undefined) {
          updates.push(`emailuser = $${paramCount}`);
          values.push(usuario.emailuser);
          paramCount++;
        }
        if (usuario.tlfuser !== undefined) {
          updates.push(`tlfuser = $${paramCount}`);
          values.push(usuario.tlfuser);
          paramCount++;
        }
        if (usuario.passw !== undefined) {
          // Hashear la nueva contraseña
          const hashedPassword = await AuthService.hashPassword(usuario.passw);
          
          updates.push(`passw = $${paramCount}`);
          values.push(hashedPassword);
          paramCount++;
        }
        if (usuario.estatus !== undefined) {
          updates.push(`estatus = $${paramCount}`);
          values.push(usuario.estatus);
          paramCount++;
        }
  
        // Si no hay nada que actualizar
        if (updates.length === 0) {
          return false;
        }
  
        query += updates.join(', ') + ` WHERE idcuentauser = $${paramCount}`;
        values.push(id);
  
        const { rowCount } = await pool.query(query, values);
        return rowCount !== null && rowCount > 0;
      } catch (error) {
        console.error(`Error al actualizar usuario con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Eliminar un usuario (cambiar estatus a INACTIVO)
    delete: async (id: number): Promise<boolean> => {
      try {
        const { rowCount } = await pool.query(
          'UPDATE cuentasusuarios SET estatus = $1 WHERE idcuentauser = $2', 
          ['INACTIVO', id]
        );
        return rowCount !== null && rowCount > 0;
      } catch (error) {
        console.error(`Error al eliminar usuario con ID ${id}:`, error);
        throw error;
      }
    },
  
    // Verificar si existe un email
    emailExists: async (email: string): Promise<boolean> => {
      try {
        const { rows } = await pool.query(
          'SELECT COUNT(*) as count FROM cuentasusuarios WHERE emailuser = $1', 
          [email]
        );
        return rows[0].count > 0;
      } catch (error) {
        console.error(`Error al verificar existencia de email ${email}:`, error);
        throw error;
      }
    }
  };