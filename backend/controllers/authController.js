/**
 * Controlador de autenticación
 * Maneja el inicio de sesión de empleados y la generación de tokens JWT
 */

import jwt from "jsonwebtoken";
import Empleado from "../models/Empleado.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // Buscar empleado por email (incluye password)
    const empleado = await Empleado.findByEmail(email);
    if (!empleado) {
        return next(new AppError("Credenciales inválidas", 400));
    }
    // Verificar contraseña usando bcrypt
    const validPassword = await Empleado.verifyPassword(password, empleado.password);
    if (!validPassword) {
        return next(new AppError("Credenciales inválidas", 400));
    }
    // Generar token JWT con expiración de 1 hora
    const token = jwt.sign(
        { id: empleado.id, nombre: empleado.nombre, rol: empleado.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
    );
    // Retornar token y datos del usuario (sin password por seguridad)
    res.json({
        token,
        user: {
            id: empleado.id,
            nombre: empleado.nombre,
            email: empleado.email,
            rol: empleado.rol,
        },
    });
});

export { login };
