/**
 * Configuracion del servidor Express de backend
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { router as authRoutes } from "./routes/authRoutes.js";
import { router as empleadoRoutes } from "./routes/empleadoRoutes.js";
import { router as productoRoutes } from "./routes/productoRoutes.js";
import { router as categoriaRoutes } from "./routes/categoriaRoutes.js";
import { router as clienteRoutes } from "./routes/clienteRoutes.js";
import { router as ventaRoutes } from "./routes/ventaRoutes.js";
import { logger } from "./middleware/logger.js";
import { testConnection } from "./utils/database.js";
import errorHandler from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";

// Obtener __dirname en ES6 modules para servir archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Cargar variables de entorno desde archivo .env
dotenv.config();
// Crear instancia de Express
const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// MIDDLEWARES
// Habilitar CORS para permitir peticiones desde el frontend
app.use(cors());
// Parsear JSON en el body de las peticiones
app.use(express.json());
// Servir archivos estáticos desde frontend/public
app.use('/img', express.static(path.join(__dirname, "../frontend/public/img")));
// Logger personalizado: imprime todas las peticiones HTTP en consola
app.use(logger);

// RUTAS
// Autenticación (login)
app.use("/auth", authRoutes);
// CRUD de recursos - Todas requieren JWT
app.use("/api/empleados", empleadoRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/ventas", ventaRoutes);

// MANEJO DE RUTAS NO ENCONTRADAS
app.use((req, res, next) => {
  // Si la ruta empieza con /api o /auth, es una ruta de API no encontrada
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/auth')) {
    return next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor`, 404));
  }
  // Si no es ruta de API, continuar al siguiente middleware
  next();
});

// ENTORNO PRODUCCIÓN / DESARROLLO
if (NODE_ENV === "production") {
  // PRODUCCIÓN: Servir frontend compilado desde dist (archivos estáticos)
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  // Fallback: todas las rutas restantes sirven index.html para SPA routing
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
} else {
  // DESARROLLO: Endpoint simple para verificar que el backend funciona
  // El frontend corre en servidor separado (Vite) en desarrollo
  app.get("/", (req, res) => {
    res.send("Backend funcionando en modo " + NODE_ENV);
  });
  // En desarrollo, si la ruta no existe muestra error y no el index estatico
  app.use((req, res, next) => {
    next(new AppError(`No se puede encontrar ${req.originalUrl} en este servidor`, 404));
  });
}

// MIDDLEWARE DE MANEJO DE ERRORES
app.use(errorHandler);

// INICIO
app.listen(PORT, async () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
  console.log(`Entorno en modo: ${NODE_ENV}`);
  // Verificar conexión a la base de datos al iniciar
  await testConnection();
});
