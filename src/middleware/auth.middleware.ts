import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

// Extender el tipo Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = {
  // Verificar autenticación
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
        return; // No continuar la ejecución
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token);
      
      if (!decoded) {
        res.status(401).json({ message: 'Token inválido o expirado' });
        return; // No continuar la ejecución
      }
      
      // Añadir usuario decodificado a la solicitud
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Error en middleware de autenticación:', error);
      res.status(401).json({ message: 'Acceso denegado' });
    }
  },

  // Verificar si es administrador
  verifyAdmin: (req: Request, res: Response, next: NextFunction) => {
    // El middleware verifyToken debe ejecutarse primero
    if (!req.user) {
        res.status(401).json({ message: 'Acceso denegado' });
        return; // No continuar la ejecución
    }
    
    if (req.user.role !== 'admin') {
        res.status(403).json({ message: 'Acceso denegado: requiere rol de administrador' });
        return; // No continuar la ejecución
    }
    
    next();
  }
};