/**
 * Modelo de Categoría
 */

import { db } from "../utils/database.js";

class Categoria {
    /**
     * Obtiene todas las categorías sin eliminar
     */
    static async findAll() {
        return await db('categoria')
            .select('id', 'nombre', 'descripcion', 'creado_en', 'actualizado_en')
            .whereNull('eliminado_en');
    }

    /**
     * Obtiene una categoría por ID
     */
    static async findById(id) {
        return await db('categoria')
            .select('id', 'nombre', 'descripcion', 'creado_en', 'actualizado_en')
            .where('id', id)
            .whereNull('eliminado_en')
            .first();
    }

    /**
     * Crea una nueva categoría
     */
    static async create(data) {
        const { nombre, descripcion } = data;
        const [insertId] = await db('categoria').insert({
            nombre,
            descripcion
        });
        // Retornar el producto completo recién creado
        return this.findById(insertId);
    }

    /**
    * Elimina una categoría (soft delete)
    */
    static async softDelete(id) {
        return await db('categoria')
            .where('id', id)
            .whereNull('eliminado_en')
            .update({ eliminado_en: db.fn.now() });
    }

    /**
     * Actualiza una categoría existente
     */
    static async update(id, data) {
        const { nombre, descripcion } = data;
        const updates = {};
        // Construir objeto solo con los campos proporcionados
        if (nombre) updates.nombre = nombre;
        if (descripcion !== undefined) updates.descripcion = descripcion;
        // Si no hay campos para actualizar, retornar null
        if (Object.keys(updates).length === 0) {
            return null;
        }
        // Actualizar el producto
        await db('categoria')
            .where('id', id)
            .update(updates);
        // Retornar el producto actualizado
        return this.findById(id);
    }
}

export default Categoria;
