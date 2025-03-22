import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Usuario } from '../models/usuario.model';

// Configuración del JWT
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'tienda-secret-key';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h') as SignOptions["expiresIn"];

export const AuthService = {
  /**
   * Genera un hash de la contraseña
   */
  hashPassword: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  /**
   * Compara una contraseña en texto plano con una contraseña hasheada
   */
  comparePassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },

  /**
   * Genera un token JWT para un usuario
   */
  generateToken: (user: Partial<Usuario>): string => {
    const payload = {
      userId: user.idCuentaUser,
      email: user.emailUser,
      role: user.roleUser || 'user'
    };

    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };

    return jwt.sign(payload, JWT_SECRET, options);
  },

  /**
   * Verifica y decodifica un token JWT
   */
  verifyToken: (token: string): any => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
};
