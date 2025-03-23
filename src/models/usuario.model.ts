export interface Usuario {
  idCuentaUser?: number;
  nombreUser: string | null;
  emailUser: string;
  tlfUser: string | null;
  passw: string;
  estatus: string;
  roleUser?: string; // Rol del usuario (admin, user, etc.)
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
      const [rows] = await pool.query(`
        SELECT idCuentaUser, nombreUser, emailUser, tlfUser, estatus, roleUser 
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
      const [rows] = await pool.query('SELECT * FROM cuentasusuarios WHERE idCuentaUser = ?', [id]);
      const usuarios = rows as Usuario[];
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error(`Error al obtener usuario con ID ${id}:`, error);
      throw error;
    }
  },

  // Encontrar usuario por email (incluye password para autenticación)
  findByEmail: async (email: string): Promise<Usuario | null> => {
    try {
      const [rows] = await pool.query('SELECT * FROM cuentasusuarios WHERE emailUser = ?', [email]);
      const usuarios = rows as Usuario[];
      return usuarios.length > 0 ? usuarios[0] : null;
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
      
      const [result] = await pool.query(
        'INSERT INTO cuentasusuarios (nombreUser, emailUser, tlfUser, passw, roleUser, estatus) VALUES (?, ?, ?, ?, ?, ?)',
        [
          usuario.nombreUser,
          usuario.emailUser,
          usuario.tlfUser,
          hashedPassword,
          usuario.roleUser || 'user', // Por defecto, rol de usuario normal
          usuario.estatus || 'ACTIVO'
        ]
      );
      
      const result2 = result as { insertId: number };
      return result2.insertId;
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
      
      const [result] = await pool.query(
        'UPDATE cuentasusuarios SET passw = ? WHERE idCuentaUser = ?',
        [hashedPassword, userId]
      );
      
      const { affectedRows } = result as { affectedRows: number };
      return affectedRows > 0;
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

      // Construimos dinámicamente la consulta
      if (usuario.nombreUser !== undefined) {
        updates.push('nombreUser = ?');
        values.push(usuario.nombreUser);
      }
      if (usuario.emailUser !== undefined) {
        updates.push('emailUser = ?');
        values.push(usuario.emailUser);
      }
      if (usuario.tlfUser !== undefined) {
        updates.push('tlfUser = ?');
        values.push(usuario.tlfUser);
      }
      if (usuario.passw !== undefined) {
        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuario.passw, salt);
        
        updates.push('passw = ?');
        values.push(hashedPassword);
      }
      if (usuario.estatus !== undefined) {
        updates.push('estatus = ?');
        values.push(usuario.estatus);
      }

      // Si no hay nada que actualizar
      if (updates.length === 0) {
        return false;
      }

      query += updates.join(', ') + ' WHERE idCuentaUser = ?';
      values.push(id);

      const [result] = await pool.query(query, values);
      const { affectedRows } = result as { affectedRows: number };
      return affectedRows > 0;
    } catch (error) {
      console.error(`Error al actualizar usuario con ID ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un usuario (cambiar estatus a INACTIVO)
  delete: async (id: number): Promise<boolean> => {
    try {
      const [result] = await pool.query('UPDATE cuentasusuarios SET estatus = ? WHERE idCuentaUser = ?', ['INACTIVO', id]);
      const { affectedRows } = result as { affectedRows: number };
      return affectedRows > 0;
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      throw error;
    }
  },

  // Verificar si existe un email
  emailExists: async (email: string): Promise<boolean> => {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM cuentasusuarios WHERE emailUser = ?', [email]);
      const result = rows as [{ count: number }];
      return result[0].count > 0;
    } catch (error) {
      console.error(`Error al verificar existencia de email ${email}:`, error);
      throw error;
    }
  }
};