/**
 * Controlador de empleados
 */

import Empleado from "../models/Empleado.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/**
 * Obtiene todos los empleados
 * Lista empleados sin el password y sin eliminados
 */
const getEmpleados = catchAsync(async (req, res, next) => {
    const empleados = await Empleado.findAll();
    res.status(200).json(empleados);
});

/**
 * Obtiene un empleado por ID
 */
const getEmpleadoById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const empleado = await Empleado.findById(id);
    if (!empleado) {
        return next(new AppError("Empleado no encontrado", 404));
    }
    res.status(200).json(empleado);
});

/**
 * Crea un nuevo empleado
 * Lo retorna sin password
 */
const createEmpleado = catchAsync(async (req, res, next) => {
    const empleado = await Empleado.create(req.body);
    res.status(200).json(empleado);
});

/**
 * Elimina un empleado por ID (soft delete)
 */
const deleteEmpleado = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const affectedRows = await Empleado.softDelete(id);
    if (affectedRows === 0) {
        return next(new AppError('Empleado no encontrado', 404));
    }
    res.status(200).json({ message: "Empleado eliminado" });
});

/**
 * Actualiza un empleado existente
 * Lo retorna sin password
 */
const updateEmpleado = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // Verificar que el empleado existe
    const empleadoExiste = await Empleado.findById(id);
    if (!empleadoExiste) {
        return next(new AppError("Empleado no encontrado", 404));
    }
    // Actualizar el empleado
    const empleadoActualizado = await Empleado.update(id, req.body);
    if (!empleadoActualizado) {
        return next(new AppError('No hay campos para actualizar', 400));
    }
    res.status(200).json(empleadoActualizado);
});

export { getEmpleados, getEmpleadoById, createEmpleado, deleteEmpleado, updateEmpleado };
