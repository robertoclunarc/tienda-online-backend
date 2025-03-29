import { Request, Response } from 'express';
import { UsuarioModel, Usuario } from '../models/usuario.model';
import { AuthService } from '../services/auth.service';

export const authController = {
  // Registro de usuario
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: Usuario = req.body;
      
      // Verificar si el correo ya está registrado
      const userExists = await UsuarioModel.findByEmail(userData.emailuser);
      if (userExists) {
        res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        return;
      }
      
      // Registrar el usuario
      const userId = await UsuarioModel.register(userData);
      
      // Crear usuario para la respuesta (sin contraseña)
      const user = {
        idcuentauser: userId,
        nombreuser: userData.nombreuser,
        emailuser: userData.emailuser,
        tlfuser: userData.tlfuser,
        estatus: userData.estatus || 'ACTIVO',
        roleuser: userData.roleuser || 'user'
      };
      
      // Generar token
      const token = AuthService.generateToken(user);
      
      res.status(201).json({
        message: 'Usuario registrado correctamente',
        token,
        user
      });
    } catch (error) {
      console.error('Error en register de authController:', error);
      res.status(500).json({ message: 'Error al registrar usuario' });
    }
  },

  // Inicio de sesión
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      // Verificar si el usuario existe
      const user = await UsuarioModel.findByEmail(email);
      if (!user) {
        res.status(400).json({ message: 'Credenciales incorrectas' });
        return;
      }
      
      // Verificar si la cuenta está activa
      if (user.estatus !== 'ACTIVO') {
        res.status(400).json({ message: 'La cuenta está desactivada' });
        return;
      }
      
      // Verificar la contraseña
      const isPasswordValid = await AuthService.comparePassword(password, user.passw);
      if (!isPasswordValid) {
        res.status(400).json({ message: 'Credenciales incorrectas' });
        return;
      }
      
      // Crear usuario para la respuesta (sin contraseña)
      const userResponse = {
        idcuentauser: user.idcuentauser,
        nombreuser: user.nombreuser,
        emailuser: user.emailuser,
        tlfuser: user.tlfuser,
        estatus: user.estatus,
        roleuser: user.roleuser
      };
      
      // Generar token
      const token = AuthService.generateToken(userResponse);
      
      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Error en login de authController:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  },

  // Cambio de contraseña
  changePassword: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      
      // Obtener usuario
      const user = await UsuarioModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      
      // Verificar contraseña actual
      const isPasswordValid = await AuthService.comparePassword(currentPassword, user.passw);
      if (!isPasswordValid) {
        res.status(400).json({ message: 'La contraseña actual es incorrecta' });
        return;
      }
      
      // Actualizar contraseña
      await UsuarioModel.changePassword(userId, newPassword);
      
      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error en changePassword de authController:', error);
      res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
  },

  // Verificar token (útil para mantener sesiones)
  verifyToken: async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = AuthService.verifyToken(token);
      
      if (!decoded) {
        res.status(401).json({ message: 'Token inválido o expirado' });
        return;
      }
      
      // Obtener datos actualizados del usuario
      const user = await UsuarioModel.findById(decoded.userId);
      if (!user || user.estatus !== 'ACTIVO') {
        res.status(401).json({ message: 'Usuario no encontrado o inactivo' });
        return;
      }
      
      // Respuesta con datos del usuario (sin contraseña)
      const userResponse = {
        idcuentauser: user.idcuentauser,
        nombreuser: user.nombreuser,
        emailuser: user.emailuser,
        tlfuser: user.tlfuser,
        estatus: user.estatus,
        roleuser: user.roleuser
      };
      
      res.json({
        user: userResponse,
        token // Devolver el mismo token para mantener la sesión
      });
    } catch (error) {
      console.error('Error en verifyToken de authController:', error);
      res.status(500).json({ message: 'Error al verificar token' });
    }
  }
};