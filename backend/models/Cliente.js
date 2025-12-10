/**
 * Modelo de Cliente
 */

import { db } from "../utils/database.js";

class Cliente {
    /**
     * Obtiene todos los clientes sin eliminar
     */
    static async findAll() {
        return await db('cliente')
            .select('id', 'nombre', 'email', 'creado_en', 'actualizado_en')
            .whereNull('eliminado_en');
    }

    /**
     * Obtiene un cliente por ID
     */
    static async findById(id) {
        return await db('cliente')
            .select('id', 'nombre', 'email', 'creado_en', 'actualizado_en')
            .where('id', id)
            .whereNull('eliminado_en')
            .first();
    }

    /**
     * Obtiene un cliente por email
     */
    static async findByEmail(email) {
        return await db('cliente')
            .select('id', 'nombre', 'email', 'creado_en', 'actualizado_en')
            .where('email', email)
            .whereNull('eliminado_en')
            .first();
    }

    /**
     * Crea un nuevo cliente
     */
    static async create(data) {
        const { nombre, email } = data;
        const [insertId] = await db('cliente').insert({
            nombre,
            email
        });
        // Retornar el producto completo recién creado
        return this.findById(insertId);
    }


    /**
     * Elimina un cliente (soft delete)
     */
    static async softDelete(id) {
        return await db('cliente')
            .where('id', id)
            .whereNull('eliminado_en')
            .update({ eliminado_en: db.fn.now() });
    }

    /**
     * Actualiza un cliente existente
     */
    static async update(id, data) {
        const { nombre, email } = data;
        const updates = {};
        // Construir objeto solo con los campos proporcionados
        if (nombre) updates.nombre = nombre;
        if (email) updates.email = email;
        // Si no hay campos para actualizar, retornar null
        if (Object.keys(updates).length === 0) {
            return null;
        }
        // Actualizar el producto
        await db('cliente')
            .where('id', id)
            .update(updates);
        // Retornar el producto actualizado
        return this.findById(id);
    }
}

export default Cliente;
