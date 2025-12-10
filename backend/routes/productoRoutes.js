/**
 * Define los endpoints CRUD para productos
 * Prefijo de ruta: /api/productos
 * Soporta subida de imágenes con multer
 */

import express from "express";
import multer from "multer";
import * as productoController from "../controllers/productoController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";
import { validateProducto } from "../middleware/validator.js";

const router = express.Router();

// Configurar multer para manejo de archivos
// Los archivos se guardan temporalmente en uploads/ antes de ser procesados
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
  fileFilter: (req, file, cb) => {
    // Solo aceptar archivos de imagen (image/jpeg, image/png, etc.)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Listar todos los productos
router.get("/", authenticateToken, productoController.getProductos);

// Obtener un producto por ID
router.get("/:id", authenticateToken, productoController.getProductoById);

// Crear nuevo producto
router.post(
  "/",
  authenticateToken,
  upload.single('imagen'), // Procesar un solo archivo con nombre 'imagen'
  validateProducto,
  productoController.createProducto,
);

// Actualizar producto por ID
router.put(
  "/:id",
  authenticateToken,
  upload.single('imagen'),
  validateProducto,
  productoController.updateProducto,
);

// Eliminar producto por ID
router.delete("/:id", authenticateToken, requireAdmin, productoController.deleteProducto);

export { router };
