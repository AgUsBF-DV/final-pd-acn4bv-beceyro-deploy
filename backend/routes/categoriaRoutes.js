/**
 * Define los endpoints de CRUD para categorías
 * Prefijo de ruta: /api/categorias
 */

import express from "express";
import * as categoriaController from "../controllers/categoriaController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";
import { validateCategoria } from "../middleware/validator.js";

const router = express.Router();

// Listar todas las categorías
router.get("/", authenticateToken, categoriaController.getCategorias);

// Obtener categoría por ID
router.get("/:id", authenticateToken, categoriaController.getCategoriaById);

// Crear nueva categoría
router.post(
  "/",
  authenticateToken,
  validateCategoria,
  categoriaController.createCategoria,
);

// Actualizar categoría por ID
router.put(
  "/:id",
  authenticateToken,
  validateCategoria,
  categoriaController.updateCategoria,
);

// Eliminar categoría por ID
router.delete("/:id", authenticateToken, requireAdmin, categoriaController.deleteCategoria);

export { router };
