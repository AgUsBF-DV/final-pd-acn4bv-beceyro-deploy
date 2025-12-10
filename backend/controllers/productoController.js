/**
 * Controlador de productos
 * Maneja CRUD de productos con soporte para imágenes con multer
 */

import Producto from "../models/Producto.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Obtener __dirname en ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Obtiene todos los productos del catálogo
 * Lista los productos sin eliminados
 */
const getProductos = catchAsync(async (req, res, next) => {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
});

/**
 * Obtiene un producto por ID
 */
const getProductoById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    if (!producto) {
        return next(new AppError("Producto no encontrado", 404));
    }
    res.status(200).json(producto);
});

/**
 * Crea un nuevo producto con imagen opcional
 * 1. Crea el producto sin imagen para obtener un ID
 * 2. Si hay imagen, la renombra con el ID y la mueve a la carpeta final
 * 3. Actualiza el producto con la ruta de la imagen
 */
const createProducto = catchAsync(async (req, res, next) => {
    // Copiar datos del body
    const productoData = { ...req.body };
    // Crear producto en base de datos (sin imagen)
    const producto = await Producto.create(productoData);
    // Si se subió una imagen, procesarla
    if (req.file) {
        const ext = path.extname(req.file.originalname);
        // Nombrar imagen con el ID del producto para evitar conflictos
        const imageName = `producto_${producto.id}${ext}`;
        const uploadPath = path.join(__dirname, "../../frontend/public/img/productos", imageName);
        // Mover archivo desde carpeta temporal (uploads/) a ubicación final
        fs.renameSync(req.file.path, uploadPath);
        // Actualizar producto con la ruta de la imagen
        const imagePath = `/img/productos/${imageName}`;
        await Producto.update(producto.id, { imagen: imagePath });
        // Retornar producto con imagen actualizada
        const productoActualizado = await Producto.findById(producto.id);
        return res.status(200).json(productoActualizado);
    }
    // Si no hay imagen, retornar producto sin imagen
    res.status(200).json(producto);
});

/**
 * Elimina un producto por ID (soft delete)
 */
const deleteProducto = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const affectedRows = await Producto.softDelete(id);
    if (affectedRows === 0) {
        return next(new AppError("Producto no encontrado", 404));
    }
    res.status(200).json({ message: "Producto eliminado" });
});

/**
 * Actualiza un producto existente
 */
const updateProducto = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // Verificar que el producto existe antes de actualizar
    const productoExiste = await Producto.findById(id);
    if (!productoExiste) {
        return next(new AppError("Producto no encontrado", 404));
    }
    const updateData = { ...req.body };
    // Si se subió una nueva imagen, procesarla
    if (req.file) {
        // Eliminar imagen anterior si existe
        if (productoExiste.imagen) {
            const oldImagePath = path.join(__dirname, "../../frontend/public", productoExiste.imagen);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Borrar archivo viejo
            }
        }
        // Procesar nueva imagen
        const ext = path.extname(req.file.originalname);
        const imageName = `producto_${id}${ext}`;
        const uploadPath = path.join(__dirname, "../../frontend/public/img/productos", imageName);
        // Mover archivo temporal a ubicación final
        fs.renameSync(req.file.path, uploadPath);
        // Incluir ruta de nueva imagen en datos de actualización
        updateData.imagen = `/img/productos/${imageName}`;
    }
    // Actualizar el producto con todos los datos
    const productoActualizado = await Producto.update(id, updateData);
    if (!productoActualizado) {
        return next(new AppError("No hay campos para actualizar", 400));
    }
    res.status(200).json(productoActualizado);
});

export { getProductos, getProductoById, createProducto, deleteProducto, updateProducto };
