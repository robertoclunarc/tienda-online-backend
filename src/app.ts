import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, testConnection2 } from './config/db.config';

// Importación de rutas
import productoRoutes from './routes/producto.routes';
import categoriaRoutes from './routes/categoria.routes';
import subcategoriaRoutes from './routes/subcategoria.routes';
import marcaRoutes from './routes/marca.routes';
import modeloRoutes from './routes/modelo.routes';
import ofertaRoutes from './routes/oferta.routes';
import usuarioRoutes from './routes/usuario.routes';
import carritoRoutes from './routes/carrito.routes';
import listaDeseosRoutes from './routes/listadeseos.routes';
import ventaRoutes from './routes/venta.routes';
import tiendaRoutes from './routes/tienda.routes';
import financiamientoRoutes from './routes/financiamiento.routes';
import contactoRoutes from './routes/contacto.routes';
import authRoutes from './routes/auth.routes';
import productosImagenesRoutes from './routes/productosImagenes.routes';

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  testConnection().catch(console.error);
}

// Rutas
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/subcategorias', subcategoriaRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/modelos', modeloRoutes);
app.use('/api/ofertas', ofertaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/listadeseos', listaDeseosRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/tiendas', tiendaRoutes);
app.use('/api/financiamientos', financiamientoRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos-imagenes', productosImagenesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Tienda Online - Funcionando correctamente' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
const startServer = async () => {
  try { 
    // Iniciar el servidor
    // Iniciar en modo no serverless
    
      app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });    
    
    // Probar la conexión a la base de datos
    await testConnection2();
    await testConnection();
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();