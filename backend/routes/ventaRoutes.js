/**
 * Define los endpoints de CRUD para ventas
 * Prefijo de ruta: /api/ventas
 */

import express from "express";
import * as ventaController from "../controllers/ventaController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";
import { validateVenta } from "../middleware/validator.js";

const router = express.Router();

// Listar todas las ventas
router.get("/", authenticateToken, ventaController.getVentas);

// Obtener venta por ID
router.get("/:id", authenticateToken, ventaController.getVentaById);

// Crear nueva venta
router.post(
  "/",
  authenticateToken,
  validateVenta,
  ventaController.createVenta,
);

// Eliminar venta por ID
router.delete("/:id", authenticateToken, requireAdmin, ventaController.deleteVenta);

export { router };
