/**
 * Controlador de categorías
 */

import Categoria from "../models/Categoria.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/**
 * Obtiene todas las categorías
 * Lista las categorías sin eliminadas
 */
const getCategorias = catchAsync(async (req, res, next) => {
    const categorias = await Categoria.findAll();
    res.status(200).json(categorias);
});

/**
 * Obtiene una categoría por ID
 */
const getCategoriaById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id);
    if (!categoria) {
        return next(new AppError("Categoría no encontrada", 404));
    }
    res.status(200).json(categoria);
});

/**
 * Crea una nueva categoría
 * La retorna
 */
const createCategoria = catchAsync(async (req, res, next) => {
    const categoria = await Categoria.create(req.body);
    res.status(200).json(categoria);
});

/**
 * Elimina una categoría por ID (soft delete)
 */
const deleteCategoria = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const affectedRows = await Categoria.softDelete(id);
    if (affectedRows === 0) {
        return next(new AppError('Categoría no encontrada', 404));
    }
    res.status(200).json({ message: "Categoría eliminada" });
});

/**
 * Actualiza una categoría existente
 * La retorna
 */
const updateCategoria = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // Verificar que la categoría existe
    const categoriaExiste = await Categoria.findById(id);
    if (!categoriaExiste) {
        return next(new AppError("Categoría no encontrada", 404));
    }
    // Actualizar la categoría
    const categoriaActualizada = await Categoria.update(id, req.body);
    if (!categoriaActualizada) {
        return next(new AppError('No hay campos para actualizar', 400));
    }
    res.status(200).json(categoriaActualizada);
});

export { getCategorias, getCategoriaById, createCategoria, deleteCategoria, updateCategoria };
