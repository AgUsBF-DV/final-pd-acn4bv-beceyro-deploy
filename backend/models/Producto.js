/**
 * Modelo de Producto
 */

import { db } from "../utils/database.js";

class Producto {
    /**
     * Obtiene todos los productos activos (no eliminados)
     */
    static async findAll() {
        return await db('producto')
            .select('id', 'nombre', 'descripcion', 'precio', 'imagen', 'stock', 'categoria_id', 'creado_en', 'actualizado_en')
            .whereNull('eliminado_en');
    }

    /**
     * Obtiene un producto específico por ID
     */
    static async findById(id) {
        return await db('producto')
            .select('id', 'nombre', 'descripcion', 'precio', 'imagen', 'stock', 'categoria_id', 'creado_en', 'actualizado_en')
            .where('id', id)
            .whereNull('eliminado_en')
            .first();
    }

    /**
     * Crea un nuevo producto en la base de datos
     */
    static async create(data) {
        const { nombre, descripcion, precio, imagen, stock = 0, categoria_id } = data;
        const [insertId] = await db('producto').insert({
            nombre,
            descripcion,
            precio,
            imagen,
            stock,
            categoria_id
        });
        // Retornar el producto completo recién creado
        return this.findById(insertId);
    }

    /**
     * Elimina un producto (soft delete)
     */
    static async softDelete(id) {
        return await db('producto')
            .where('id', id)
            .whereNull('eliminado_en')
            .update({ eliminado_en: db.fn.now() });
    }

    /**
     * Actualiza un producto existente
     */
    static async update(id, data) {
        const { nombre, descripcion, precio, imagen, stock, categoria_id } = data;
        const updates = {};
        // Construir objeto solo con los campos proporcionados
        if (nombre) updates.nombre = nombre;
        if (descripcion !== undefined) updates.descripcion = descripcion;
        if (precio !== undefined) updates.precio = precio;
        if (imagen !== undefined) updates.imagen = imagen;
        if (stock !== undefined) updates.stock = stock;
        if (categoria_id) updates.categoria_id = categoria_id;
        // Si no hay campos para actualizar, retornar null
        if (Object.keys(updates).length === 0) {
            return null;
        }
        // Actualizar el producto
        await db('producto')
            .where('id', id)
            .update(updates);
        // Retornar el producto actualizado
        return this.findById(id);
    }
}

export default Producto;
