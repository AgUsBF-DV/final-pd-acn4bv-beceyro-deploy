/**
 * Define los endpoints de CRUD para clientes
 * Prefijo de ruta: /api/clientes
 */

import express from "express";
import * as clienteController from "../controllers/clienteController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";
import { validateCliente } from "../middleware/validator.js";

const router = express.Router();

// Listar todos los clientes
router.get("/", authenticateToken, clienteController.getClientes);

// Obtener cliente por ID
router.get("/:id", authenticateToken, clienteController.getClienteById);

// Crear nuevo cliente
router.post(
  "/",
  authenticateToken,
  validateCliente,
  clienteController.createCliente,
);

// Actualizar cliente por ID
router.put(
  "/:id",
  authenticateToken,
  validateCliente,
  clienteController.updateCliente,
);

// Eliminar cliente por ID
router.delete("/:id", authenticateToken, requireAdmin, clienteController.deleteCliente);

export { router };
