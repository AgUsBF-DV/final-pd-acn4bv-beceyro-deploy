/**
 * Middleware de autenticación JWT
 * Verifica que las peticiones incluyan un token válido
 */

import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const authenticateToken = (req, res, next) => {
  // Obtener token del header Authorization (formato: "Bearer TOKEN")
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Acceso denegado. No se proporcionó token.", 401));
  }

  // Verificar token con la clave secreta
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Diferenciar entre token expirado e inválido
      if (err.name === 'TokenExpiredError') {
        return next(new AppError("Token expirado. Por favor, inicia sesión nuevamente.", 401));
      }
      return next(new AppError("Token inválido.", 403));
    }
    // Agregar datos del usuario al request para uso en controladores
    req.user = user;
    next();
  });
};

/**
 * Middleware para verificar que el usuario tenga rol de administrador
 * Debe usarse después de authenticateToken
 */
const requireAdmin = (req, res, next) => {
  // req.user ya está disponible gracias a authenticateToken
  if (!req.user || req.user.rol !== 'admin') {
    return next(new AppError("Acceso denegado. Se requieren permisos de administrador.", 403));
  }
  next();
};

export { authenticateToken, requireAdmin };
