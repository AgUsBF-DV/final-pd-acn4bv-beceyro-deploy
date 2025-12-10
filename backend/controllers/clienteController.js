/**
 * Controlador de clientes
 */

import Cliente from "../models/Cliente.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/**
 * Obtiene todos los clientes
 * Lista los clientes sin eliminados
 */
const getClientes = catchAsync(async (req, res, next) => {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
});

/**
 * Obtiene un cliente por ID
 */
const getClienteById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);
    if (!cliente) {
        return next(new AppError("Cliente no encontrado", 404));
    }
    res.status(200).json(cliente);
});

/**
 * Crea un nuevo cliente
 * Lo retorna
 */
const createCliente = catchAsync(async (req, res, next) => {
    const cliente = await Cliente.create(req.body);
    res.status(200).json(cliente);
});

/**
 * Elimina un cliente por ID (soft delete)
 */
const deleteCliente = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const affectedRows = await Cliente.softDelete(id);
    if (affectedRows === 0) {
        return next(new AppError('Cliente no encontrado', 404));
    }
    res.status(200).json({ message: "Cliente eliminado" });
});

/**
 * Actualiza un cliente existente
 * Lo retorna
 */
const updateCliente = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // Verificar que el cliente existe
    const clienteExiste = await Cliente.findById(id);
    if (!clienteExiste) {
        return next(new AppError("Cliente no encontrado", 404));
    }
    // Actualizar el cliente
    const clienteActualizado = await Cliente.update(id, req.body);
    if (!clienteActualizado) {
        return next(new AppError('No hay campos para actualizar', 400));
    }
    res.status(200).json(clienteActualizado);
});

export { getClientes, getClienteById, createCliente, deleteCliente, updateCliente };
