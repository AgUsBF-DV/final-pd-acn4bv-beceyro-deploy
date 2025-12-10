/**
 * Define los endpoints de CRUD para empleados
 * Prefijo de ruta: /api/empleados
 */

import express from "express";
import * as empleadoController from "../controllers/empleadoController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";
import { validateEmpleado } from "../middleware/validator.js";

const router = express.Router();

// Listar todos los empleados
router.get("/", authenticateToken, empleadoController.getEmpleados);

// Obtener empleado por ID
router.get("/:id", authenticateToken, empleadoController.getEmpleadoById);

// Crear nuevo empleado
router.post(
  "/",
  authenticateToken,
  validateEmpleado,
  empleadoController.createEmpleado,
);

// Actualizar empleado por ID
router.put(
  "/:id",
  authenticateToken,
  validateEmpleado,
  empleadoController.updateEmpleado,
);

// Eliminar empleado por ID
router.delete("/:id", authenticateToken, requireAdmin, empleadoController.deleteEmpleado);

export { router };
