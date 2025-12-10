/**
 * Define los endpoints de login y autenticación
 * Prefijo de ruta: /auth
 */

import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Iniciar sesión con email y password
router.post("/login", authController.login);

export { router };
